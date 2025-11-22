import sys
import json
import openai
import os
from dotenv import load_dotenv
import fitz  # PyMuPDF
from xhtml2pdf import pisa  # For HTML -> PDF conversion

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def improve_cv(pdf_path):
    # Extract text from PDF
    try:
        doc = fitz.open(pdf_path)
        extracted_text = ""
        for page in doc:
            extracted_text += page.get_text("text") + "\n"
    except Exception as e:
        print(json.dumps({"error": f"Failed to read PDF: {str(e)}"}))
        sys.exit(1)

    if not extracted_text.strip():
        print(json.dumps({"error": "No text extracted from PDF"}))
        sys.exit(1)

    # GPT prompt with professional HTML template
    prompt = f"""
    You are a world-class CV designer, recruiter, and HTML/CSS expert.
    Transform the following raw CV text into a **professional, recruiter-ready CV in HTML format** using the template below.
    The final output must be polished, centered, readable, and visually appealing. Use modern fonts, proper spacing, and a compact layout for PDF conversion.

    **IMPORTANT:** Do **NOT** translate any content or headings. Keep all text in the **original language** (French, English, or mixed). Only improve grammar, phrasing, and formatting.

    **Requirements:**
    1.  **Layout & Style**
        * Font: Sans-serif (Arial, Roboto, Helvetica), body 12-14px, headings 16-24px.
        * Center content horizontally, max-width 800px.
        * Use subtle colors for headings/dividers.
        * Collapse all vertical spacing; avoid extra gaps from `<p>` or `<div>` tags.
        * Use inline-block or flex where possible to reduce gaps.
        * All CSS embedded in `<style>` tags.

    2.  **Sections**
        * Merge "Compétences" and "Autres" into **Skills & Languages**.
        * Group technical skills logically with bold labels.
        * Exclude empty sections (Certifications, Projects).

    3.  **Formatting**
        * Bold Name, Job Titles, Companies, Degrees.
        * Keep all content in the **original language** while improving readability and grammar.
        * For Work Experience & Education:
            - Use `<div class="row">` with `<h3>` for title/company and `<span class="date">` right-aligned.
            - Use `<ul><li>` for bullet points with minimal spacing.
        * Reduce `<p>` margins to 0-2px and line-height 1.2-1.3.
        * Dates aligned to the right, titles left.

    **HTML Template**
    <html>
    <head>
    <style>
    body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; margin:0; padding:0; }}
    .container {{ max-width:800px; margin:20px auto; padding:20px; background:#fff; }}
    h1 {{ font-size:24px; margin-bottom:5px; text-align:center; color:#2c3e50; }}
    .contact-info p {{ font-size:13px; margin:1px 0; text-align:center; }}

    h2 {{ font-size:18px; margin:5px 0 3px 0; color:#000; border-bottom:1px solid #ddd; padding-bottom:2px; }}
    .row {{ display:flex; justify-content:space-between; align-items:baseline; margin:1px 0; }}
    h3 {{ font-size:15px; margin:0; font-weight:bold; color:#000; }}
    .date {{ font-size:13px; font-style:italic; flex-shrink:0; text-align:right; margin:0; }}
    p, li {{ font-size:13px; margin:1px 0; line-height:1.2; }}
    ul {{ margin:2px 0 5px 20px; padding:0; }}
    li {{ margin-bottom:1px; }}
    .skills-list p {{ margin:0; padding:0; }}
    </style>
    </head>
    <body>
    <div class="container">

    <div class="contact-info">
    <h1>{{Full Name}}</h1>
    <p>{{Address}} | {{Phone}} | {{Email}} | {{GitHub/LinkedIn}}</p>
    </div>

    <h2>{{Summary Heading}}</h2>
    <p>{{Summary}}</p>

    <h2>{{Work Experience Heading}}</h2>
    <div>{{Formatted Work Experience}}</div>

    <h2>{{Education Heading}}</h2>
    <div>{{Formatted Education}}</div>

    <h2>{{Skills & Languages Heading}}</h2>
    <div class="skills-list">
    <p><strong>{{Technical Skills Label}}:</strong> {{Categorized Technical Skills}}</p>
    <p><strong>{{Competencies Label}}:</strong> {{Soft Skills}}</p>
    <p><strong>{{Languages Label}}:</strong> {{Languages}}</p>
    </div>

    </div>
    </body>
    </html>

    **Instructions:**
    - Use the **original headings from the CV** for all `<h2>` section titles.
    - Keep all CV text in its **original language**; do **not translate**.
    - Improve grammar, phrasing, and formatting only.
    - Collapse vertical gaps; output compact HTML especially in Work Experience and Education.
    - Output only HTML. **Do not include Markdown code fences.**

    Raw CV Text:
    {extracted_text}
    """


    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional CV designer."},
                {"role": "user", "content": prompt}
            ]
        )
        html_content = response.choices[0].message.content
    except Exception as e:
        print(json.dumps({"error": f"OpenAI API error: {str(e)}"}))
        sys.exit(1)

    # Ensure output directory exists
    output_dir = r"C:\Users\BALI\Documents\improvedCvs"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "Improved-CV.pdf")

    # Convert HTML -> PDF using xhtml2pdf
    try:
        with open(output_path, "wb") as f:
            pisa_status = pisa.CreatePDF(html_content, dest=f)
        if pisa_status.err:
            raise Exception("PDF generation error")
    except Exception as e:
        print(json.dumps({"error": f"Failed to create PDF: {str(e)}"}))
        sys.exit(1)

    print(json.dumps({"file": output_path}))
    sys.stdout.flush()


if __name__ == "__main__":
    improve_cv(sys.argv[1])

