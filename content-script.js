window.addEventListener("load", searchForWords);
navigation.addEventListener("navigate", searchForWords);
let keyInterval, key, isHolding;
window.addEventListener("keydown", (e) => {
	const toEnd = e.shiftKey;
	if (isHolding) return;

	isHolding = !toEnd;
	key = e.key;
	onKey(key, toEnd);
	setTimeout(() => {
		if (isHolding) {
			keyInterval = setInterval(() => {
				if (!isHolding) return clearInterval(keyInterval);
				onKey(key, toEnd);
			}, 100);
		}
	}, 50);
});
window.addEventListener("keyup", (e) => {
	clearInterval(keyInterval);
	isHolding = false;
});

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
	words = [...wordBank.children];

	current =
		words.find((w) => {
			let letter = w.children[0].children[0].children[1].innerText[0];
			if (letter === letter.toUpperCase()) return true;
		}) || words[0];

	focus(current);
}

function onKey(key, toEnd) {
	switch (key) {
		case "ArrowRight":
			if (toEnd) {
				while (toEnd) {
					toEnd = !move("r");
				}
			} else {
				move("r");
			}
			break;
		case "ArrowLeft":
			if (toEnd) {
				while (toEnd) {
					toEnd = !move("l");
				}
			} else {
				move("l");
			}
			break;
		case "ArrowUp":
			if (toEnd) {
				while (toEnd) {
					toEnd = !move("u");
				}
			} else {
				move("u");
			}
			break;
		case "ArrowDown":
			if (toEnd) {
				while (toEnd) {
					toEnd = !move("d");
				}
			} else {
				move("d");
			}
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
	if (!el || el.children[0].nodeName !== "SPAN") return true;

	if (el.ariaDisabled === "true") {
		focus(el.parentNode.parentNode);
		const isEnd = move(dir);

		if (!isEnd) return;
	}

	focus(el.parentNode.parentNode);
}
