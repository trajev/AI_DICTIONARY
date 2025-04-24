const User = require('../models/User.models.js');
const WordEntry = require('../models/WordEntry.models.js');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

const defineWord = async (req, res) => {
  try {
    const word = req.body.word;

    if (!word) {
      return res.status(400).json({ success: false, message: "Please provide a word" });
    }

    const user = await User.findById(req.user._id);
    const wordExists = await WordEntry.findOne({ word });

    if (wordExists) {
      if (wordExists.userSearched.includes(user._id)) {
        return res.status(200).json({ success: true, message: "Word Searched Successfully, exists", data: wordExists });
      }

      await WordEntry.updateOne({ _id: wordExists._id }, { $addToSet: { userSearched: user._id } });
      return res.status(200).json({ success: true, message: "Word Searched Successfully, exists", data: wordExists });
    }

    const prompt = `
You are a dictionary assistant. I will give you one English word. Return a complete, rich, and well-structured dictionary entry using proper Markdown formatting. Your output will be shown in a dictionary app UI.

### Important:
- You must define only this exact word: **"${word}"**
- Do not define a similar or related word.
- If the word is not a valid English word, respond clearly:
  > "The word '${word}' is not recognized as a valid English word."

Please follow this exact format using Markdown syntax:

## ${word}

**Pronunciation**\n
- Provide phonetic spelling (IPA or simplified).

**Part of Speech**\n
- State whether it's a noun, verb, adjective, etc.

**Etymology**\n
- A short history or origin of the word (Latin, Greek roots, etc.).

**Meanings and Definitions**\n
Start with a general definition, then list detailed meanings:

1. **Definition 1:**\n
   - *Example sentence using the word in italics.*
2. **Definition 2:**\n
   - *Example sentence using the word in italics.*
3. **Definition 3 (if applicable):**\n
   - *Example sentence using the word in italics.*

**Synonyms**\n
- List 5–10 synonyms as bullet points using '-'.

**Antonyms**\n
- List 3–5 antonyms as bullet points using '-'.

**Usage Examples**\n
Provide 3–5 well-written full sentences using the word naturally in different real-world contexts. Format them as a **Markdown numbered list** like this:

1. The word should be used in a real-life, natural sentence.
2. Another different example with the word in a different context.
3. A third sentence using the word clearly in another domain.
4. (Optional) Include a fourth usage for extra clarity.
5. (Optional) A fifth usage if relevant.

Make sure:
- Each point starts with '1.', '2.', '3.' and so on.
- Each sentence is unique and practical.
- Avoid compact or overly academic examples.

**Translations in Top 5 Indian Languages**\n
For each language, include:

- The word in native script
- Pronunciation (in brackets)
- One example sentence using that translation
- Translated English version

Format:

- **Hindi:** परिभाषा *(Paribhasha)*
  - यह शब्द की स्पष्ट परिभाषा है।
  - *This is the clear definition of the word.*

- **Bengali:** সংজ্ঞা *(Shongga)*
  - এটি শব্দের একটি পরিষ্কার সংজ্ঞা।
  - *This is a clear definition of the word.*

(Repeat for Tamil, Telugu, Marathi)

---
Use clean Markdown formatting with proper line breaks. Make the content UI-ready. Do not shorten or skip any section.

`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const content = response.candidates[0].content.parts[0].text;

    if (!content.toLowerCase().includes(word.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Given incorrect defination, Please try again!" });
    }

    const wordEntry = await WordEntry.create({
      word,
      definition: content,
      userSearched: [user._id]
    });

    const bookmarked = false;
    if( user.bookmarks.includes(wordEntry._id) ){
      bookmarked = true;
    }

    res.status(200).json({ success: true, message: "Word searched successfully", data: wordEntry, isBookmarked: bookmarked });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error at searching word through API", error: err.message });
  }
};


const bookmarkWord = async (req, res) => {
  try{

    const user = await User.findById(req.user._id);

    console.log( user )


    const wordId = req.body.wordId;

    if(!wordId){
      return res.status(400).json({ success: false, message: "Please provide a wordId" });
    }

    const wordEntry = await WordEntry.findById(wordId);
    if( !wordEntry ){
      return res.status(400).json({ success: false, message: "Word not found" });
    }

    res.status(200).json({ success: true, message: "Word found", data: wordEntry });

  } catch(err){
    res.status(500).json({ success: false, message: "Error at bookmarking word", error: err.message });
  }
}





module.exports = { defineWord , bookmarkWord};
