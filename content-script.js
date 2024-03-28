window.addEventListener("load", searchForWords);

function searchForWords() {
	const i = setInterval(() => {
		const wordBank = document.querySelector("[data-test=word-bank]");
		if (wordBank) {
			clearInterval(i);
			setUp(wordBank);
		}
	}, 500);
}

let current, words;

function setUp(wordBank) {
	words = wordBank.children;

	current = words[0];
}

window.addEventListener("keyup", (e) => onkeydown(e));

function onkeydown(e) {
	switch (e.key) {
		case "ArrowRight":
			move("r");
			break;
		case "ArrowLeft":
			move("l");
			break;
		case "ArrowUp":
			move("u");
			break;
		case "ArrowDown":
			move("d");
			break;
		case " ":
			if (current) {
				current.children[0].children[0].click();
			}
			break;
		case "Enter":
			setTimeout(searchForWords, 500);
		default:
			setTimeout(() => {
				const newEl = document.getElementsByClassName(
					"n2-shortcut-desc n2-answer-text"
				);
				if (newEl.length !== 0) {
					focus(newEl[0].parentNode.parentNode.parentNode);
				}
			}, 300);
	}
}

function focus(el) {
	current = el;
	for (const word of words) {
		word.style.transform = "translateY(0px)";
	}
	el.style.transform = "translateY(-10px)";
}

function move(dir) {
	const coord = current.getBoundingClientRect();
	let elelemnts;
	switch (dir) {
		case "r":
			elelemnts = document.elementsFromPoint(
				coord.right + 10,
				coord.top + coord.height / 2
			);
			break;
		case "l":
			elelemnts = document.elementsFromPoint(
				coord.left - 10,
				coord.top + coord.height / 2
			);
			break;
		case "u":
			elelemnts = [
				...document.elementsFromPoint(
					coord.left + coord.width / 2,
					coord.top - coord.height / 2
				),
				...document.elementsFromPoint(
					coord.left + 10,
					coord.top - coord.height / 2
				),
				...document.elementsFromPoint(
					coord.right - 10,
					coord.top - coord.height / 2
				),
			];
			break;
		case "d":
			elelemnts = [
				...document.elementsFromPoint(
					coord.left + coord.width / 2,
					coord.bottom + coord.height / 2
				),
				...document.elementsFromPoint(
					coord.left + 10,
					coord.bottom + coord.height / 2
				),
				...document.elementsFromPoint(
					coord.right - 10,
					coord.bottom + coord.height / 2
				),
			];
			break;
	}
	const el = elelemnts.find((el) => el.nodeName === "BUTTON");
	if (el.children[0].nodeName !== "SPAN") return true;

	if (el.ariaDisabled === "true") {
		focus(el.parentNode.parentNode);
		const isEnd = move(dir);

		if (!isEnd) return;
	}

	focus(el.parentNode.parentNode);
}
