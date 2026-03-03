# 🎓 Scholarhat

The fastest, easiest way for students to find local scholarships. 
No registration, no data storage, open source, and completely free.

## 🚀 Why this exists
National scholarship databases are overwhelming and heavily gated. Scholarhat is a hyper-local, fast aggregator designed to remove friction. It does not collect user data and links students directly to the official application pages.

## 🛠️ Tech Stack
- **Framework:** [Astro](https://astro.build)
- **UI:** React & Tailwind CSS
- **Data:** Flat JSON structure

## 🤝 How to Contribute (Add a Scholarship)
This project is open source! If you know of a local scholarship that isn't on the list, you can add it easily:

1. Fork this repository.
2. Open `src/data/scholarships.json`.
3. Add a new JSON object to the array with the following format:
   ```json
   {
     "id": 99,
     "title": "Name of Scholarship",
     "amount": "$1,000",
     "open_date": "YYYY-MM-DD",
     "deadline": "YYYY-MM-DD",
     "audience": "Who qualifies for this?",
     "url": "https://link-to-application.com"
   }