#!/usr/bin/env python3
"""
Single File Lead Enricher Script
===============================

This script processes a single CSV file and enriches it with personalized icebreakers
generated using the Grok API. Allows for customizable prompts and better cost control.

Author: Flux AI Assistant
Requirements: pandas, requests
Usage: python lead_enricher_single.py filename.csv
"""

import os
import sys
import time
import requests
import pandas as pd
from pathlib import Path
from typing import Dict, Any


# Updated and Enhanced SingleFileLeadEnricher Class

class SingleFileLeadEnricher:
    """
    A class to handle the enrichment of a single lead CSV file with AI-generated icebreakers.
    """
    
    def __init__(self, output_folder: str = "output_data", model: str = "grok-3"):
        self.output_folder = Path(output_folder)
        # --- ENHANCEMENT: Make the model a parameter for flexibility ---
        self.model = model
        self.api_key = None
        self.api_url = 'https://api.x.ai/v1/chat/completions'
        self._setup_grok_client()
        self._ensure_output_folder_exists()
    
    def _setup_grok_client(self) -> None:
        api_key = os.environ.get("XAI_API_KEY")
        if not api_key:
            print("Error: XAI_API_KEY environment variable not found.")
            sys.exit(1)
        
        self.api_key = api_key
        print("✓ Grok API client initialized successfully")
    
    def _ensure_output_folder_exists(self) -> None:
        self.output_folder.mkdir(exist_ok=True)
        print(f"✓ Output folder ready: {self.output_folder}")
    
    def _call_grok_api(self, prompt: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            # --- ENHANCEMENT: Use the model parameter ---
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            # --- ENHANCEMENT: Reduced max_tokens as we want a single, concise sentence ---
            "max_tokens": 50,
            "response_format": {"type": "text"}
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=45)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}

    # --- ENHANCEMENT: THIS IS THE CRITICAL PROMPT OVERHAUL (V2) ---
    def _create_enhanced_prompt(self, company_name: str, headline: str, first_name: str) -> str:
        """
        Creates the V2 enhanced prompt for high-quality, unique icebreakers.
        """
        company_name = company_name if pd.notna(company_name) else "their company"
        headline = headline if pd.notna(headline) else "their role"
        
        prompt = f'''
        You are "Flux", an expert AI sales assistant. Your task is to generate a single, unique, and specific opening sentence for a professional outreach email. This sentence is the icebreaker.

        **CRITICAL RULES:**
        1.  **PRIORITIZE THE HEADLINE:** The lead's `headline` is the most important piece of information. Use it to understand their specific role or specialty.
        2.  **BE A DETECTIVE, NOT A GUESSER:** Make a specific, insightful observation based on the data. Do not invent generic compliments.
        3.  **VARY YOUR VOCABULARY & STRUCTURE:** Do not use the same opening phrase (like "I was impressed by...") or sentence structure for every lead.
        4.  **FOCUS 100% ON THEM:** The entire sentence must be about the lead or their company. Do not include phrases like "I'm also passionate about..."
        5.  **NO WEAK TRANSITIONS:** The icebreaker must be a standalone sentence. Do not end with "Wanted to run something by you."
        6.  **BE PUNCHY & CONFIDENT:** Adopt a sharp, clever, and peer-to-peer tone. Aim for a "punchy" observation, not a long, academic sentence. Make it sound like it was written by a confident human.
        7.  **KEEP IT A SINGLE SENTENCE.**

        **Lead's Information:**
        - Company Name: "{company_name}"
        - Headline: "{headline}"

        **Generated Icebreaker:**
        '''
        return prompt.strip()

    def _generate_icebreaker(self, row: pd.Series) -> str:
        company_name = row.get('employment_history/0/organization_name', '')
        headline = row.get('headline', '')
        first_name = row.get('first_name', '')
        
        prompt = self._create_enhanced_prompt(company_name, headline, first_name)
        
        try:
            response = self._call_grok_api(prompt)
            
            if "error" in response:
                return f"API_ERROR: {response['error']}"
            
            icebreaker = response["choices"][0]["message"]["content"].strip().replace('"', '')
            
            # --- ENHANCEMENT: Simplified post-processing. The better prompt requires less fixing. ---
            # A good icebreaker often naturally includes the name. If not, we can add it.
            if first_name.lower() not in icebreaker.lower():
                 icebreaker = f"{first_name}, {icebreaker[0].lower() + icebreaker[1:]}"
            
            return icebreaker
            
        except Exception as e:
            return f"SCRIPT_ERROR: {str(e)}"
    
    def process_file(self, csv_file: str, start_row: int = 0, max_rows: int = None) -> None:
        csv_path = Path(csv_file)
        if not csv_path.exists():
            print(f"❌ File not found: {csv_file}")
            return
        
        print(f"\n📄 Processing: {csv_path.name}")
        
        # --- ENHANCEMENT: Robust resume logic ---
        # Check for the latest progress file to resume from
        progress_files = sorted(self.output_folder.glob(f"{csv_path.stem}_progress_*.csv"), reverse=True)
        if progress_files:
            latest_progress_file = progress_files[0]
            resume_response = input(f"  ❓ Found progress file '{latest_progress_file.name}'. Resume from it? (y/n): ")
            if resume_response.lower() == 'y':
                csv_path = latest_progress_file
                print(f"  🔄 Resuming from {csv_path.name}")

        try:
            df = pd.read_csv(csv_path)
            print(f"  📊 Loaded {len(df)} total rows")
            
            if 'icebreaker' not in df.columns:
                df['icebreaker'] = ""
                print("  ✅ Created new 'icebreaker' column")
            else:
                print("  ✅ Found existing 'icebreaker' column")
            
            # Apply row filtering BEFORE processing
            if start_row > 0:
                df = df.iloc[start_row:].copy()
                print(f"  ✂️  Starting from row {start_row + 1}")
            
            if max_rows:
                df = df.head(max_rows).copy()
                print(f"  🎯 Processing maximum {max_rows} rows")
            
            # --- ENHANCEMENT: Simplified way to find rows to process ---
            df['icebreaker'] = df['icebreaker'].fillna('').astype(str)
            to_process_mask = df['icebreaker'].str.strip() == ""
            leads_to_process_df = df[to_process_mask]
            
            if len(leads_to_process_df) == 0:
                print("  ℹ️  All leads already have icebreakers. Nothing to do.")
                return

            print(f"  🎯 Found {len(leads_to_process_df)} leads needing an icebreaker.")
            
            # (Your cost estimation and confirmation logic is great, keep it as is)
            
            processed_count = 0
            for index, row in leads_to_process_df.iterrows():
                processed_count += 1
                company_name = row.get('employment_history/0/organization_name', 'Unknown')
                print(f"  ⚡ Processing lead {processed_count}/{len(leads_to_process_df)}: {row['first_name']} at {company_name}")
                
                icebreaker = self._generate_icebreaker(row)
                df.at[index, 'icebreaker'] = icebreaker
                
                time.sleep(1) # Rate limiting
                
                if processed_count % 25 == 0:
                    # --- ENHANCEMENT: Save progress back to the *main* dataframe copy ---
                    temp_output = self.output_folder / f"{csv_path.stem}_progress_{df.index.get_loc(index) + 1}.csv"
                    df.to_csv(temp_output, index=False)
                    print(f"  💾 Progress saved: {processed_count} leads processed")
            
            output_filename = csv_path.stem.replace('_progress_', '_final_') + "_with_icebreakers.csv"
            output_path = self.output_folder / output_filename
            df.to_csv(output_path, index=False)
            
            print(f"\n  🎉 Success! Enriched data saved to: {output_path}")

        except Exception as e:
            print(f"  ❌ An unexpected error occurred: {str(e)}")


def main():
    # ... (Your main function is perfect, no changes needed) ...
    if len(sys.argv) < 2:
        print("Usage: python lead_enricher_single.py <csv_file> [start_row] [max_rows]")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    # NOTE: With the new resume logic, start_row and max_rows are less critical but can still be used for batching
    start_row = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    max_rows = int(sys.argv[3]) if len(sys.argv) > 3 else None
    
    print("🚀 Starting Single File Lead Enrichment with Grok 3")
    print("=" * 60)
    
    enricher = SingleFileLeadEnricher()
    enricher.process_file(csv_file, start_row, max_rows)

if __name__ == "__main__":
    main()