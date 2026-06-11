# 📚 EXAM LIBRARY (TAMIL RESOURCE POOL)

பிரத்தியேக தரம் 6 முதல் உயர்தர (A/L) மாணவர்களுக்கான தமிழ் வழிப் பாடநூல்கள், கடந்த கால வினாத்தாள்கள் மற்றும் விளக்கக் காணொளிகள் கொண்ட ஒரு முழுமையான கல்வித்தளம்.

This is a comprehensive, sleek Tamil medium study resource pool including NIE textbooks, Past Exam Papers (G.C.E O/L & A/L), and highly tailored lesson explanation videos, featuring instant PDF pre-viewing, seamless dark/light modes, and dynamic language toggling (Tamil / English).

---

## 🚀 GitHub இல் பதிவேற்றி இணையதளத்தை இயக்குவது எப்படி? (Tamil Instructions)

இந்த இணையதளத்தை உங்கள் **GitHub Pages** இல் இலவசமாக நேரடியாகவும் தானியக்கமாகவும் இயக்க நாங்கள் ஒரு **GitHub Actions Workflow** ஐ அமைத்துள்ளோம்.

### படி 1: குறியீட்டைப் பதிவிறக்கவும் (Download Code)
1. AI Studio-விலிருந்து இந்த விளையாட்டை அல்லது இணையதளத்தை உங்களது கணினியில் **Export to ZIP** அல்லது Settings-லிருந்து தரவிறக்கம் செய்துகொள்ளுங்கள்.
2. பதிவிறக்கம் செய்யப்பபட்ட ZIP கோப்பை உங்கள் கணினியில் ஏதேனும் ஒரு கோப்புறையில் (Folder) பிரித்தெடுக்கவும் (Extract).

### படி 2: மாபெரும் புதிய GitHub Repository ஒன்றை உருவாக்கவும் (Create GitHub Repository)
1. உங்கள் [GitHub வலைத்தளத்திற்கு](https://github.com/) செல்லவும்.
2. வலது மேல் மூலையிலுள்ள `+` குறியீட்டை அழுத்தி **New repository** என்பதைத் தேர்ந்தெடுக்கவும்.
3. **Repository name** ஆக `Exam-library` போன்ற ஒரு பெயரை இடுங்கள்.
4. இதை **Public** ஆக வைக்கவும் (GitHub Pages இலவசமாக இயங்க இது அவசியம்).
5. "Initialize this repository with" பகுதிக்குள் எதையும் தேர்ந்தெடுக்காமல் **Create repository** என்பதை அழுத்துங்கள்.

### படி 3: குறியீட்டை ஏற்றி இணைக்கவும் (Upload Code to GitHub)
உங்கள் கணிணியிலுள்ள பிரித்தெடுக்கப்பட்ட கோப்புகளை உங்களது GitHub பக்கத்தில் பதிவேற்றலாம்:
```bash
git init
git add .
git commit -m "Initial upload with automated deployment workflow"
git branch -M main
git remote add origin https://github.com/உங்களது-பயனர்-பெயர்/Exam-library.git
git push -u origin main
```
*(அல்லது நீங்கள் எளிய முறையில் கோப்புகளை இழுத்துப் போட்டும் (Drag & Drop) உங்களது பிரதான GitHub வலைப்பக்கத்தில் பதிவேற்றலாம்).*

### படி 4: தானியங்கி இணையதள முறையை செயல்படுத்தவும் (Enable GitHub Pages)
குறியீடுகள் ஏறியதும், அது இணையதளமாக இயங்க சில முக்கிய அமைப்புகளைச் செய்ய வேண்டும்:
1. உங்கள் GitHub Repository-இன் மேல் உள்ள **Settings** பக்கத்திற்குச் செல்லவும்.
2. இடதுபுறம் உள்ள பட்டிப்பகுதியில் **Pages** என்பதைத் தேர்ந்தெடுக்கவும்.
3. **Build and deployment** என்ற பகுதியில் உள்ள **Source** என்பதற்கு கீழே உள்ள தேர்வை மாற்றி **GitHub Actions** என்பதைத் தெரிவு செய்யுங்கள்!
4. இப்போது உங்களது இணையதளம் தானாகவே கட்டப்பட்டு (Compile), சில நொடிகளில் நேரலையில் இயங்க ஆரம்பிக்கும்!
5. உங்கள் தளம் இயங்கும் முகவரி: `https://உங்களது-பயனர்-பெயர்.github.io/Exam-library/`

---

## 🚀 How to Run and Upload this Website on GitHub (English Instructions)

We have pre-configured this React website using a **GitHub Actions Workflow** that will automatically build and publish your web page to **GitHub Pages** for free!

### Step 1: Download the Source Code
1. Export or download this complete repository/codebase as a ZIP file from AI Studio settings/menu.
2. Extract the downloaded ZIP file to safe directory folder in your computer.

### Step 2: Create a New Repository on GitHub
1. Login to your [GitHub Account](https://github.com/).
2. Click on the `+` sign at the top right and select **New repository**.
3. Set your repository name (e.g., `Exam-library`).
4. Ensure it is configured to be **Public** (required for free GitHub Pages).
5. Click **Create repository** (do not add a README or .gitignore automatically, as we already have them).

### Step 3: Push Your Code to GitHub
Open your terminal in the extracted folder and run:
```bash
git init
git add .
git commit -m "Initialize React app with auto deploy config"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/Exam-library.git
git push -u origin main
```
*(Alternatively, you can just drag and drop all the files directly onto the GitHub repository web portal to upload them).*

### Step 4: Configure GitHub Pages Source
To let GitHub Action build and run your website:
1. Navigate to your repository **Settings** tab.
2. On the left sidebar, click on **Pages**.
3. Under the **Build and deployment** section, look for **Source**.
4. Change the dropdown option from *"Deploy from a branch"* to **GitHub Actions**.
5. Once selected, GitHub will automatically trigger the deployment action! You can track the progress under the **Actions** tab on top of your repository page.
6. When completed, your website will be live at: `https://YOUR-GITHUB-USERNAME.github.io/Exam-library/`

Enjoy studying and customizing your exam library! 🎓✨
