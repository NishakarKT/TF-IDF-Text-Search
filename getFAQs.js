// run the code below on ircell.iitkgp.ac.in 's home page's browser console
const faqs = {};
Array.from(document.querySelectorAll(".panel")).forEach(panel => {
    const question = panel.querySelector(".panel-title > span:nth-child(2)").innerText.replaceAll(/\s+/g, ' ').trim();
    const answer = panel.querySelector(".panel-body").innerText.replaceAll(/\s+/g, ' ').trim();
    faqs[question] = answer;
});
console.log(JSON.stringify(faqs));