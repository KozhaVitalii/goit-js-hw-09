!function(){var t,n={startBtn:document.querySelector("[data-start]"),stopBtn:document.querySelector("[data-stop]")};n.startBtn.addEventListener("click",(function(){var e=document.querySelector("body");t=setInterval((function(){e.style.backgroundColor="#".concat(Math.floor(16777215*Math.random()).toString(16).padStart(6,0)),n.startBtn.disabled=!0}),1e3)})),n.stopBtn.addEventListener("click",(function(){clearInterval(t),n.startBtn.disabled=!1}))}();
//# sourceMappingURL=01-color-switcher.55137b72.js.map