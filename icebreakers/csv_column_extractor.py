#!/usr/bin/env python3
"""
CSV Column Extractor
==================

Extracts the first 8 columns from CSV files for lead processing.
"""

import pandas as pd
from pathlib import Path
import sys

def extract_first_8_columns(input_file: str, output_file: str = None):
    """
    Extract the first 8 columns from a CSV file.
    
    Args:
        input_file (str): Path to input CSV file
        output_file (str): Path to output CSV file (optional)
    """
    try:
        # Read the CSV
        df = pd.read_csv(input_file)
        print(f"📊 Original file has {len(df.columns)} columns, {len(df)} rows")
        print(f"📋 Original columns: {list(df.columns)}")
        
        # Take first 8 columns
        df_filtered = df.iloc[:, :8]  # First 8 columns
        
        print(f"✂️  Extracted columns: {list(df_filtered.columns)}")
        
        # Generate output filename if not provided
        if not output_file:
            input_path = Path(input_file)
            output_file = f"{input_path.stem}_first_8_cols.csv"
        
        # Save the filtered data
        df_filtered.to_csv(output_file, index=False)
        print(f"✅ Saved filtered data to: {output_file}")
        
    except Exception as e:
        print(f"❌ Error processing {input_file}: {e}")

def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage: python csv_column_extractor.py input_file.csv [output_file.csv]")
        print("Example: python csv_column_extractor.py my_leads.csv")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    extract_first_8_columns(input_file, output_file)

if __name__ == "__main__":
    main() 