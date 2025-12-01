# GhostEYE - Small Open Source Intelligence

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-blue)
![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20%2F%203.0-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

**Nexus Intel** is a next-generation Open Source Intelligence (OSINT) search and correlation engine. It leverages the power of **Google Gemini 2.5 Flash** and **Gemini 3 Pro (Thinking Model)** with **Google Search Grounding** to discover, analyze, and cross-reference public digital footprints.

Unlike standard search engines, Nexus Intel acts as an automated investigator, deconstructing queries, verifying sources, and providing structured entity profiles with confidence scores.

## 🚀 Key Features

*   **Multi-Modal Search:** Support for Usernames, Emails, Phone Numbers, Physical Addresses, Specific Text Content, and URL/Link analysis.
*   **AI-Powered Reasoning:**
    *   **Standard Mode:** Uses `gemini-2.5-flash` for fast, grounded lookups.
    *   **Deep Intelligence Mode:** Uses `gemini-3-pro-preview` with **Thinking Config** (8k token budget) for complex reasoning and deep validation.
*   **Google Search Grounding:** Real-time access to the live web to fetch up-to-date information, bypassing knowledge cutoffs.
*   **Data Cross-Referencing:** Intelligent logic to link multiple data points (e.g., matching a Username to an Email found on a different platform).
*   **Command-Line Style Interface:** Power-user friendly input with flag support (e.g., `johndoe -u`).
*   **State Persistence:** Automatically saves your query configuration and filters via LocalStorage.
*   **Cyberpunk UI:** A fully responsive, immersive dark-mode interface built with Tailwind CSS.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS, Lucide React (Icons)
*   **AI Integration:** `@google/genai` SDK
*   **Models Used:**
    *   `gemini-2.5-flash` (Speed & General Querying)
    *   `gemini-3-pro-preview` (Deep Search & Reasoning)

## 📋 Prerequisites

To run this application, you need a **Google Gemini API Key** with access to the paid tier (required for Search Grounding and specific models).

1.  Get an API key from [Google AI Studio](https://aistudiocdn.google.com/).
2.  Ensure your project is linked to a billing account to enable **Google Search Grounding**.

## 💻 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/nexus-intel.git
    cd nexus-intel
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm start
    ```

## 🔍 Usage Guide

### Command Flags
You can force specific search types directly in the search bar using flags:

| Flag | Long Flag | Description | Example |
| :--- | :--- | :--- | :--- |
| **-u** | `--username` | Search for social handles/usernames | `ghost_rider -u` |
| **-e** | `--email` | Search for email address footprints | `contact@example.com -e` |
| **-p** | `--phone` | Search for phone numbers | `+15550199 -p` |
| **-a** | `--address` | Search for physical locations | `123 Baker St London -a` |
| **-t** | `--text` | Search for specific content/titles | `Project Bluebook PDF -t` |
| **-l** | `--url` | Analyze a domain or link reputation | `example.com -l` |
| **-all** | `--all` | Automatic inference (Default) | `John Doe` |

### Filter Panel
Click the **Filter Icon** to access advanced controls:

*   **Exact Match:** Forces the AI to discard fuzzy matches (useful for common names).
*   **Data Cross-Ref:** Strict mode. If you provide "Name" + "City", it only returns results linking *both*.
*   **Social Networks:** Specifically targets social media platforms in the search strategy.
*   **Deep Intelligence:** Switches to **Gemini 3 Pro** with a high "Thinking Budget". This is slower but performs significantly better validation and hallucination checks.

## 🧠 How It Works

1.  **Deconstruction:** The app parses your query and flags to identify the intent.
2.  **Prompt Engineering:** A dynamic system instruction is sent to Gemini, configuring it as an "OSINT Investigator."
3.  **Grounding:** Gemini generates search queries for Google Search, retrieves snippets, and processes the raw HTML/text.
4.  **Reasoning:**
    *   It looks for "Pivot Points" (e.g., a GitHub profile linking to a personal website).
    *   It assigns confidence scores (High/Medium/Low) based on data corroboration.
5.  **Structured Output:** The raw AI response is parsed into a structured JSON format to render the UI cards.

## ⚠️ Disclaimer & Ethical Use

**Nexus Intel is intended for educational and legitimate research purposes only.**

*   Do not use this tool to harass, stalk, or doxx individuals.
*   Do not use this tool to violate terms of service of third-party platforms.
*   The data provided is based on publicly available information indexed by Google. The accuracy relies on the source data.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
