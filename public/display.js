console.log("display.js for blogDetails");
console.log(document.location.href.slice(document.location.href.length-24,document.location.href.length))
// Fetch the content (read as marked down text)
const mdt = document.getElementById('aContent').textContent;
// const markdownText = "# Hello, World!\nThis is **bold** text.";
// const htmlOutput = marked.parse(markdownText);
// Parse the marked down text to HTML
const htmlOutput = marked.parse(mdt);
// console.log(htmlOutput); // "<h1>Hello, World!</h1><p>This is <strong>bold</strong> text.</p>"
// Render the HTML text
document.getElementById('aContent').innerHTML = htmlOutput;