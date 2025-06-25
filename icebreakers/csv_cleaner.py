#!/usr/bin/env python3
"""
CSV Cleaner Script
=================

Removes rows with empty email addresses from CSV files.
This ensures all leads have valid email addresses for outreach.
"""

import pandas as pd
from pathlib import Path
import os

def clean_csv_file(input_file: str, output_file: str = None) -> dict:
    """
    Clean a CSV file by removing rows with empty email addresses.
    
    Args:
        input_file (str): Path to input CSV file
        output_file (str): Path to output CSV file (optional)
        
    Returns:
        dict: Statistics about the cleaning process
    """
    try:
        # Read the CSV file
        df = pd.read_csv(input_file)
        original_count = len(df)
        
        print(f"\n📄 Processing: {Path(input_file).name}")
        print(f"  📊 Original rows: {original_count}")
        
        # Check if email column exists
        if 'email' not in df.columns:
            print("  ❌ No 'email' column found!")
            return {"error": "No email column found"}
        
        # Count empty emails before cleaning
        empty_emails = df['email'].isna() | (df['email'] == "") | (df['email'].str.strip() == "")
        empty_count = empty_emails.sum()
        
        print(f"  📧 Empty emails: {empty_count}")
        
        # Remove rows with empty emails
        df_cleaned = df[~empty_emails].copy()
        final_count = len(df_cleaned)
        
        print(f"  ✨ Cleaned rows: {final_count}")
        print(f"  🗑️  Removed: {empty_count} rows")
        
        # Generate output filename if not provided
        if not output_file:
            input_path = Path(input_file)
            output_file = input_path.parent / f"{input_path.stem}_cleaned.csv"
        
        # Save the cleaned data
        df_cleaned.to_csv(output_file, index=False)
        print(f"  ✅ Saved to: {output_file}")
        
        return {
            "original_count": original_count,
            "final_count": final_count,
            "removed_count": empty_count,
            "output_file": output_file
        }
        
    except Exception as e:
        print(f"  ❌ Error processing {input_file}: {e}")
        return {"error": str(e)}

def clean_all_csvs_in_folder(folder_path: str = "input_data"):
    """
    Clean all CSV files in the input_data folder.
    
    Args:
        folder_path (str): Path to folder containing CSV files
    """
    folder = Path(folder_path)
    
    if not folder.exists():
        print(f"❌ Folder '{folder_path}' does not exist")
        return
    
    csv_files = list(folder.glob("*.csv"))
    if not csv_files:
        print(f"❌ No CSV files found in '{folder_path}'")
        return
    
    print("🧹 Starting CSV Cleaning Process")
    print("=" * 50)
    
    total_original = 0
    total_final = 0
    total_removed = 0
    
    cleaned_files = []
    
    for csv_file in csv_files:
        # Skip already cleaned files
        if "_cleaned" in csv_file.stem:
            continue
            
        result = clean_csv_file(str(csv_file))
        
        if "error" not in result:
            total_original += result["original_count"]
            total_final += result["final_count"]
            total_removed += result["removed_count"]
            cleaned_files.append(result["output_file"])
    
    print("\n" + "=" * 50)
    print("📊 SUMMARY:")
    print(f"  📁 Files processed: {len([f for f in csv_files if '_cleaned' not in f.stem])}")
    print(f"  📊 Total original rows: {total_original:,}")
    print(f"  ✨ Total final rows: {total_final:,}")
    print(f"  🗑️  Total removed: {total_removed:,}")
    print(f"  📈 Retention rate: {(total_final/total_original*100):.1f}%")
    
    print(f"\n✅ Cleaned files ready for processing:")
    for file in cleaned_files:
        print(f"  • {Path(file).name}")
    
    print(f"\n💡 Next steps:")
    print(f"  1. Review the cleaned files")
    print(f"  2. Run: python lead_enricher.py")

def main():
    """Main function."""
    # Clean all CSV files in the input_data folder
    clean_all_csvs_in_folder("input_data")

if __name__ == "__main__":
    main() 