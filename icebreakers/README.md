# Lead Enricher Tool

A Python script that enriches CSV files containing business leads with AI-generated personalized icebreakers using the Grok 3 API.

## Features

- 🔄 **Batch Processing**: Automatically processes all CSV files in the input folder
- 🤖 **AI-Powered**: Uses Grok 3 model for generating icebreakers
- 📊 **Progress Tracking**: Real-time progress updates for each file and lead
- ⚡ **Rate Limiting**: Built-in 1-second delay between API calls to respect rate limits
- 🛡️ **Error Handling**: Graceful error handling for API failures and missing data
- 📁 **Organized Output**: Creates organized output with clear naming conventions

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Grok API Key

Set your Grok API key as an environment variable:

```bash
export XAI_API_KEY='your-api-key-here'
```

Or add it to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
echo 'export XAI_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

### 3. Prepare Your Data

Create an `input_data` folder and place your CSV files there:

```
icebreakers/
├── input_data/
│   ├── leads_batch1.csv
│   ├── leads_batch2.csv
│   └── ...
├── output_data/          # Created automatically
├── lead_enricher.py
└── requirements.txt
```

## CSV Format Requirements

Your input CSV files must contain these columns:
- `headline`: The person's professional headline/title
- `employment_history/0/organization_name`: The company name

Example CSV structure:
```csv
headline,employment_history/0/organization_name,email,first_name,last_name
Senior Software Engineer,Google,john@example.com,John,Doe
Marketing Director,Apple,jane@example.com,Jane,Smith
```

## Usage

Simply run the script:

```bash
python lead_enricher.py
```

The script will:
1. 🔍 Find all CSV files in the `input_data` folder
2. 📊 Process each file row by row
3. 🤖 Generate personalized icebreakers using AI
4. 💾 Save enriched data to `output_data` folder with "_with_icebreakers" suffix

## Output

For each input file like `leads_batch1.csv`, you'll get:
- `output_data/leads_batch1_with_icebreakers.csv`

The output includes all original columns plus a new `icebreaker` column with AI-generated content.

## Example Icebreakers Generated

- "Love seeing Google's continued innovation in cloud infrastructure!"
- "Apple's latest product launches have been absolutely game-changing."
- "The marketing strategies at your company are really setting industry standards."

## Error Handling

The script handles various error scenarios:
- ❌ Missing API key
- ❌ Missing required columns
- ❌ API connection issues
- ❌ Empty or malformed CSV files

If an icebreaker can't be generated for a specific lead, the `icebreaker` column will contain "Could not generate icebreaker".

## Performance

- **Rate Limiting**: 1 second delay between API calls
- **Cost Estimation**: ~$0.002 per lead (varies by icebreaker length)
- **Processing Time**: ~1-2 seconds per lead including API delay

## Troubleshooting

### "XAI_API_KEY environment variable not found"
Make sure your API key is properly set:
```bash
echo $XAI_API_KEY
```

### "No CSV files found in 'input_data'"
Create the `input_data` folder and add your CSV files:
```bash
mkdir input_data
# Add your CSV files to this folder
```

### "Missing required columns"
Ensure your CSV has both required columns:
- `headline`
- `employment_history/0/organization_name`

## API Usage

The script uses Grok 3 model with:
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 100 (concise icebreakers)
- **Model**: grok-3 (powerful and cost-effective)

## Contributing

Feel free to suggest improvements or report issues! 