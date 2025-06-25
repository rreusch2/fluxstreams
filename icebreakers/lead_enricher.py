#!/usr/bin/env python3
"""
Lead Enricher Script
====================

This script processes CSV files containing business leads and enriches them with
personalized icebreakers generated using the Grok API.

Author: Flux AI Assistant
Requirements: pandas, requests
Usage: python lead_enricher.py
"""

import os
import sys
import time
import requests
import pandas as pd
from pathlib import Path
from typing import List, Optional, Dict, Any


class LeadEnricher:
    """
    A class to handle the enrichment of lead CSV files with AI-generated icebreakers.
    """
    
    def __init__(self, input_folder: str = "input_data", output_folder: str = "output_data"):
        """
        Initialize the LeadEnricher with input and output folder paths.
        
        Args:
            input_folder (str): Path to folder containing input CSV files
            output_folder (str): Path to folder for output CSV files
        """
        self.input_folder = Path(input_folder)
        self.output_folder = Path(output_folder)
        self.api_key = None
        self.api_url = 'https://api.x.ai/v1/chat/completions'
        self._setup_grok_client()
        self._ensure_output_folder_exists()
    
    def _setup_grok_client(self) -> None:
        """
        Set up the Grok client using the API key from environment variables.
        """
        api_key = os.environ.get("XAI_API_KEY")
        if not api_key:
            print("Error: XAI_API_KEY environment variable not found.")
            print("Please set your Grok API key as an environment variable:")
            print("export XAI_API_KEY='your-api-key-here'")
            sys.exit(1)
        
        self.api_key = api_key
        print("✓ Grok API client initialized successfully")
    
    def _ensure_output_folder_exists(self) -> None:
        """
        Create the output folder if it doesn't exist.
        """
        self.output_folder.mkdir(exist_ok=True)
        print(f"✓ Output folder ready: {self.output_folder}")
    
    def _get_csv_files(self) -> List[Path]:
        """
        Get all CSV files from the input folder.
        
        Returns:
            List[Path]: List of CSV file paths
        """
        if not self.input_folder.exists():
            print(f"Error: Input folder '{self.input_folder}' does not exist.")
            print("Please create the folder and add your CSV files.")
            sys.exit(1)
        
        csv_files = list(self.input_folder.glob("*.csv"))
        if not csv_files:
            print(f"No CSV files found in '{self.input_folder}'")
            sys.exit(1)
        
        print(f"✓ Found {len(csv_files)} CSV file(s) to process")
        return csv_files
    
    def _call_grok_api(self, prompt: str) -> Dict[str, Any]:
        """
        Call the Grok API with the given prompt.
        
        Args:
            prompt (str): The prompt to send to Grok
            
        Returns:
            Dict[str, Any]: API response
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "grok-3",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 100,
            "response_format": {"type": "text"}
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=45)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
    
    def _generate_icebreaker(self, company_name: str, headline: str) -> str:
        """
        Generate an icebreaker using the Grok API.
        
        Args:
            company_name (str): The company name
            headline (str): The person's headline/title
            
        Returns:
            str: Generated icebreaker or error message
        """
        # Handle missing or empty data
        company_name = company_name if pd.notna(company_name) else "Unknown Company"
        headline = headline if pd.notna(headline) else "Professional"
        
        prompt = f'''You are "Flux", an expert AI sales assistant. Your task is to generate a short, casual, one-sentence icebreaker to start a professional outreach email.

**Rules:**
- The icebreaker must be a single sentence.
- It should sound natural and human, not like a robot.
- It should be based on the provided company name and headline.
- DO NOT use generic phrases like "I was impressed by," "I came across your profile," or "Hope you're having a great day."
- Be complimentary and specific where possible. If the headline is generic, focus on the company.

**Lead's Information:**
- Company Name: "{company_name}"
- Headline: "{headline}"

**Generated Icebreaker:**'''

        try:
            response = self._call_grok_api(prompt)
            
            if "error" in response:
                print(f"  ⚠️  API error for {company_name}: {response['error']}")
                return "Could not generate icebreaker"
            
            icebreaker = response["choices"][0]["message"]["content"].strip()
            return icebreaker
            
        except Exception as e:
            print(f"  ⚠️  API error for {company_name}: {str(e)}")
            return "Could not generate icebreaker"
    
    def _process_csv_file(self, csv_file: Path) -> None:
        """
        Process a single CSV file and enrich it with icebreakers.
        
        Args:
            csv_file (Path): Path to the CSV file to process
        """
        print(f"\n📄 Processing: {csv_file.name}")
        
        try:
            # Read the CSV file
            df = pd.read_csv(csv_file)
            print(f"  📊 Loaded {len(df)} rows")
            
            # Check for required columns
            required_columns = ['headline', 'employment_history/0/organization_name']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                print(f"  ❌ Missing required columns: {missing_columns}")
                print(f"  Available columns: {list(df.columns)}")
                return
            
            # Initialize the icebreaker column if it doesn't exist
            if 'icebreaker' not in df.columns:
                df['icebreaker'] = ""
                print("  ✅ Created new 'icebreaker' column")
            else:
                print("  ✅ Found existing 'icebreaker' column")
            
            # Count how many rows need icebreakers (empty or NaN)
            empty_icebreakers = df['icebreaker'].isna() | (df['icebreaker'] == "") | (df['icebreaker'].str.strip() == "")
            leads_to_process = empty_icebreakers.sum()
            
            if leads_to_process == 0:
                print("  ℹ️  All leads already have icebreakers. Skipping this file.")
                return
            
            print(f"  🎯 Will generate icebreakers for {leads_to_process} leads (skipping {len(df) - leads_to_process} existing)")
            
            # Process each row that needs an icebreaker
            processed_count = 0
            for index, row in df.iterrows():
                # Skip if this row already has an icebreaker
                if pd.notna(row['icebreaker']) and str(row['icebreaker']).strip() != "":
                    continue
                
                company_name = row['employment_history/0/organization_name']
                headline = row['headline']
                processed_count += 1
                
                print(f"  🔄 Processing lead {processed_count}/{leads_to_process}: {company_name}")
                
                # Generate icebreaker
                icebreaker = self._generate_icebreaker(company_name, headline)
                df.at[index, 'icebreaker'] = icebreaker
                
                # Rate limiting - be nice to the API
                time.sleep(1)
            
            # Save the enriched data
            output_filename = csv_file.stem + "_with_icebreakers.csv"
            output_path = self.output_folder / output_filename
            
            df.to_csv(output_path, index=False)
            print(f"  ✅ Saved enriched data to: {output_path}")
            
        except Exception as e:
            print(f"  ❌ Error processing {csv_file.name}: {str(e)}")
    
    def run(self) -> None:
        """
        Main method to run the lead enrichment process.
        """
        print("🚀 Starting Lead Enrichment Process with Grok 3")
        print("=" * 50)
        
        # Get all CSV files
        csv_files = self._get_csv_files()
        
        # Process each file
        for csv_file in csv_files:
            self._process_csv_file(csv_file)
        
        print("\n" + "=" * 50)
        print("🎉 Lead enrichment process completed!")
        print(f"📁 Check your results in: {self.output_folder}")


def main():
    """
    Main function to run the lead enricher.
    """
    enricher = LeadEnricher()
    enricher.run()


if __name__ == "__main__":
    main() 