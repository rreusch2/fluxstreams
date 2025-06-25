#!/usr/bin/env python3
"""
Test Script for Lead Enricher
============================

This script tests the basic functionality without making actual API calls.
Use this to verify your CSV structure and setup before running the full enricher.
"""

import os
import pandas as pd
from pathlib import Path


def test_csv_structure():
    """Test that the CSV files have the required columns."""
    input_folder = Path("input_data")
    
    if not input_folder.exists():
        print("❌ Error: input_data folder does not exist")
        return False
    
    csv_files = list(input_folder.glob("*.csv"))
    if not csv_files:
        print("❌ Error: No CSV files found in input_data folder")
        return False
    
    print(f"✅ Found {len(csv_files)} CSV file(s)")
    
    required_columns = ['headline', 'employment_history/0/organization_name']
    
    for csv_file in csv_files:
        print(f"\n📄 Testing: {csv_file.name}")
        
        try:
            df = pd.read_csv(csv_file)
            print(f"  📊 Rows: {len(df)}")
            print(f"  📋 Columns: {list(df.columns)}")
            
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                print(f"  ❌ Missing required columns: {missing_columns}")
                return False
            else:
                print("  ✅ All required columns present")
                
            # Show sample data
            print("\n  📋 Sample data:")
            for i, row in df.head(3).iterrows():
                company = row['employment_history/0/organization_name']
                headline = row['headline']
                print(f"    {i+1}. {company} - {headline}")
                
        except Exception as e:
            print(f"  ❌ Error reading {csv_file.name}: {e}")
            return False
    
    return True


def test_api_key():
    """Test that the Grok API key is set."""
    api_key = os.environ.get("XAI_API_KEY")
    if not api_key:
        print("❌ XAI_API_KEY environment variable not set")
        print("   Set it with: export XAI_API_KEY='your-key-here'")
        return False
    else:
        print(f"✅ Grok API key found (length: {len(api_key)} chars)")
        return True


def test_dependencies():
    """Test that required dependencies are installed."""
    try:
        import pandas
        print(f"✅ pandas version: {pandas.__version__}")
    except ImportError:
        print("❌ pandas not installed. Run: pip install pandas")
        return False
    
    try:
        import requests
        print(f"✅ requests version: {requests.__version__}")
    except ImportError:
        print("❌ requests not installed. Run: pip install requests")
        return False
    
    return True


def main():
    """Run all tests."""
    print("🧪 Running Lead Enricher Tests")
    print("=" * 40)
    
    tests = [
        ("Dependencies", test_dependencies),
        ("CSV Structure", test_csv_structure),
        ("API Key", test_api_key),
    ]
    
    all_passed = True
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}:")
        if not test_func():
            all_passed = False
    
    print("\n" + "=" * 40)
    if all_passed:
        print("🎉 All tests passed! Ready to run lead_enricher.py")
    else:
        print("❌ Some tests failed. Fix the issues above before proceeding.")


if __name__ == "__main__":
    main() 