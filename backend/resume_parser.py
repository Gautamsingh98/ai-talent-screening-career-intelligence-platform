import pymupdf


def extract_text_from_pdf(file_path):

    text = ""

    try:

        document = pymupdf.open(file_path)
        for page in document:

            text += page.get_text()

        document.close()

        return text.strip()

    except Exception as e:

        print("PDF extraction error:", e)

        return ""