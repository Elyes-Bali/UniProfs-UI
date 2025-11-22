import sys
import json
import pdfplumber
from openai import OpenAI
from concurrent.futures import ThreadPoolExecutor # <-- NEW: For parallel execution
import fitz # <-- For faster PDF text extraction
import os
from dotenv import load_dotenv
load_dotenv()
# === 1. Read input arguments ===
pdf_path = sys.argv[1]
settings = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {
    "focus": "Key Concepts & Definitions",
    "language": "English"
}

focus_area = settings.get("focus", "Key Concepts & Definitions")
language = settings.get("language", "English")

# === 2. Initialize OpenAI ===
# NOTE: It is highly recommended to use environment variables for API keys instead of hardcoding

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- Function to determine prompt based on settings ---
def get_prompts(focus_area, language, chunk):
    """Generates system content and user prompt for a specific chunk."""
    if focus_area == "Exam Practice Questions":
        user_prompt = (
            f"Generate a comprehensive exam or practice set (with solutions/answers) based on the following content.\n"
            f"Output language: {language}\n"
            f"Ensure a variety of question types are used, including mathematical problems, proofs, long-form essays, and definitions, as appropriate to the source material.\n"
            f"Provide clear, logical structure using HTML (<section>, <h2>, <h3>, <ul>, <ol>, <li>, <p>).\n\n"
            f"{chunk}"
        )
        system_content = (
            "You are an expert teacher specializing in creating high-quality, varied exam papers. "
            "Your task is to generate questions and detailed answers/solutions from the provided content chunk. "
            "**Crucially, prioritize the appropriate question format:**\n"
            "- For Mathematics, Science, or Engineering topics, generate **step-by-step problems and proofs**. Use LaTeX syntax inside `<code>` tags for complex formulas.\n"
            "- For Humanities or Literature, generate **essay prompts and analysis questions**.\n"
            "- For foundational material, use a mix of multiple-choice, true/false, and short answer questions.\n"
            "Maintain a structured HTML output. Do not summarize the original content."
            "**DO NOT include Markdown code fences (e.g., ```html or ```) around the HTML output.**"
        )

    elif focus_area == "Formulas and Equations":
        user_prompt = (
            f"Extract all important formulas and equations from the following content.\n"
            f"Output language: {language}\n"
            f"Provide them in structured HTML with sections and bullet points.\n\n"
            f"{chunk}"
        )
        system_content = (
            "You are an expert in mathematics and science. Extract formulas and equations "
            "from the content. Provide clear HTML structure with headings and lists."
            "**DO NOT include Markdown code fences (e.g., ```html or ```) around the HTML output.**"
        )

    elif focus_area == "Historical/Contextual Background":
        user_prompt = (
            f"Summarize the historical and contextual background of the following content.\n"
            f"Output language: {language}\n"
            f"Use structured HTML (<section>, <h2>, <h3>, <ul>, <li>).\n\n"
            f"{chunk}"
        )
        system_content = (
            "You are an expert historian. Provide a structured HTML summary of the historical "
            "or contextual background of the content. Focus on clarity and key points."
            "**DO NOT include Markdown code fences (e.g., ```html or ```) around the HTML output.**"
        )

    elif focus_area == "Answer Questions":
        user_prompt = (
            f"Provide detailed answers to all questions mentioned in the following content.\n"
            f"Output language: {language}\n"
            f"For mathematics or technical problems, show step-by-step solutions, explanations, and final answers.\n"
            f"Use HTML structure (<section>, <h2>, <h3>, <ul>, <li>, <p>) for each question and answer.\n"
            f"If formulas are needed, include them in readable HTML or LaTeX syntax inside <code> tags.\n\n"
            f"{chunk}"
        )
        
        system_content = (
            "You are an expert educator and mathematician. Your goal is to extract questions from the content "
            "and provide thorough, step-by-step solutions and answers. Use structured HTML for clarity:\n"
            "- <section> for each question-answer block\n"
            "- <h2> for question titles\n"
            "- <h3> for solution steps\n"
            "- <ul>/<li> for listing steps or multiple answers\n"
            "- <p> for explanations\n"
            "Include final answers clearly, and handle formulas properly in HTML or LaTeX inside <code> tags. "
            "Be precise and detailed, especially for mathematical calculations."
            "**DO NOT include Markdown code fences (e.g., ```html or ```) around the HTML output.**"
        )
    elif focus_area == "Convert courses into flashcards":
        user_prompt = (
            f"Convert the following course material into a series of highly effective flashcards (Question/Front and Answer/Back pairs).\n"
            f"Output language: {language}\n"
            f"Focus on extracting key terms, definitions, concepts, and relationships.\n"
            f"Present each flashcard pair clearly using structured HTML.\n\n"
            f"{chunk}"
        )
        system_content = (
            "You are an expert tutor creating study materials. Generate a list of concise, high-yield flashcards "
            "from the content. Every key piece of information should be converted into a Q&A format.\n"
            "**Use the following strict HTML structure for each flashcard:**\n"
            "<section class=\"flashcard\">"
            "<h2>Q: [The Question/Front]</h2>"
            "<p>A: [The Answer/Back with detail]</p>"
            "</section>\n"
            "Ensure the output is clean HTML only. Do not summarize or include explanations outside of the flashcard structure."
            "**DO NOT include Markdown code fences (e.g., ```html or ```) around the HTML output.**"
        )
    elif focus_area == "Check and improve assignment":
        user_prompt = (
            f"Review the following assignment content carefully.\n"
            f"Output language: {language}\n"
            f"Your task is to:\n"
            f"- Check for clarity, correctness, coherence, and logical flow.\n"
            f"- Suggest improvements in style, grammar, structure, and argumentation.\n"
            f"- Highlight weak sections and propose stronger alternatives.\n"
            f"- Ensure alignment with academic standards and avoid plagiarism.\n"
            f"- Provide feedback using clear HTML sections: <section>, <h2>, <h3>, <ul>, <li>, <p>.\n"
            f"- If helpful, include improved rewritten versions of paragraphs.\n"
            f"- If formulas or technical concepts exist, verify correctness and suggest improvements.\n\n"
            f"{chunk}"
        )
        
        system_content = (
            "You are an expert academic reviewer and senior professor. "
            "Your task is to analyze the assignment content critically and suggest improvements. "
            "Ensure the following:\n"
            "- Provide constructive feedback on structure, logic, argument strength, and clarity.\n"
            "- Correct grammar and writing quality where needed.\n"
            "- If a better version exists, rewrite paragraphs and indicate 'Improved Version'.\n"
            "- Use HTML formatting only, with sections structured as follows:\n"
            "<section>\n"
            "<h2>[Feedback Category]</h2>\n"
            "<h3>Issues</h3>\n"
            "<ul><li>List each issue</li></ul>\n"
            "<h3>Suggestions</h3>\n"
            "<ul><li>Provide improvements</li></ul>\n"
            "<p><b>Improved Version (if applicable):</b> Rewritten content...</p>\n"
            "</section>\n"
            "Be precise, objective, and concise. Avoid general comments or summarizing. "
            "Focus on improving academic quality and correctness.\n"
            "**DO NOT include Markdown code fences (e.g., ```html or ```) around the HTML output.**"
        )
    else:
        # Default summarization
        user_prompt = (
            f"Summarize the following chunk into a clear, structured HTML summary.\n"
            f"Focus area: {focus_area}\n"
            f"Output language: {language}\n"
            f"Preserve meaning but remove unnecessary or repeated details.\n"
            f"Use sections (<section>, <h2>, <h3>) and bullet points.\n"
            f"Do NOT output code fences or extra explanations.\n\n"
            f"{chunk}"
        )
        system_content = (
            "You are an expert summarizer. Your goal is to create a clean, structured HTML summary "
            "that captures the main ideas, key objectives, important findings or actions, and the meaning "
            "behind the content. Keep summaries concise (40–70% compression)."
            "Do NOT output code fences or explanations like 'This HTML code...' or '```html'"
            "No fluff. No restating very long descriptions."
            "Produce structured insight, not just lists of headings."
            "**DO NOT include Markdown code fences (e.g., ```html or ```) around the HTML output.**"
        )
        
    return system_content, user_prompt

# === 3. Extract text from PDF (Using fitz for speed) ===
text = ""
try:
    with fitz.open(pdf_path) as pdf_doc:
        total_pages = len(pdf_doc)
        for i, page in enumerate(pdf_doc):
            text += page.get_text() + "\n"
            progress = int((i + 1) / total_pages * 50)
            print(json.dumps({"progress": progress}), flush=True)
except Exception as e:
    # Print error to stderr so the calling Node.js process can catch it
    print(f"Error during PDF extraction (fitz/PyMuPDF): {e}", file=sys.stderr, flush=True)
    # Re-raise the exception or exit if extraction is mandatory
    sys.exit(1)

# === 4. Split text into chunks ===
MAX_CHUNK_SIZE = 5000
chunks = [text[i:i + MAX_CHUNK_SIZE] for i in range(0, len(text), MAX_CHUNK_SIZE)]

# --- Function to process a single chunk using OpenAI ---
def process_chunk(idx, chunk):
    """Processes a single chunk by generating prompts and calling the OpenAI API."""
    system_content, user_prompt = get_prompts(focus_area, language, chunk)
    
    # === Call OpenAI ===
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_content},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.3,
        max_tokens=3000 # Optimized token limit
    )
    
    # Return the index and the summary content
    return idx, response.choices[0].message.content

# === 5. Prepare system/user prompt based on focus (PARALLELIZED) ===
summaries = [""] * len(chunks) # Initialize list for results
results_received = 0

if chunks:
    # Use ThreadPoolExecutor to run API calls concurrently
    with ThreadPoolExecutor(max_workers=8) as executor: # Set max workers (e.g., 8)
        # Map the chunks to the process_chunk function, keeping track of futures
        future_to_chunk = {executor.submit(process_chunk, idx, chunk): idx for idx, chunk in enumerate(chunks)}
        
        # Process results as they complete
        for future in future_to_chunk:
            try:
                idx, summary_content = future.result()
                summaries[idx] = summary_content # Place the result in the correct order
                
                results_received += 1
                
                # Send progress update in the 50-100% range
                progress = 50 + int(results_received / len(chunks) * 50)
                print(json.dumps({"progress": progress}), flush=True)
                
            except Exception as exc:
                # Log the error and insert a helpful placeholder for the user
                print(f"Chunk processing failed (Index {future_to_chunk[future]}): {exc}", file=sys.stderr, flush=True)
                summaries[future_to_chunk[future]] = f"<section><h2>Error Processing Chunk {future_to_chunk[future] + 1}</h2><p>Could not generate summary for this section due to an API error.</p></section>"
                results_received += 1
                progress = 50 + int(results_received / len(chunks) * 50)
                print(json.dumps({"progress": progress}), flush=True)
                

# === 6. Return final result ===
final_summary = "\n\n".join(summaries)
print(json.dumps({"summary": final_summary, "progress": 100}), flush=True)