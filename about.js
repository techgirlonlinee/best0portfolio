// document.addEventListener("DOMContentLoaded", function () {
// 	const overlay = document.getElementById("overlay");
// 	const bioLink = document.querySelector(".bio-link");

// 	if (bioLink && overlay) {
// 		bioLink.addEventListener("click", function (e) {
// 			e.preventDefault();
// 			overlay.classList.toggle("active");
// 		});
// 	}
// });

document.addEventListener("DOMContentLoaded", function () {
	const overlay = document.getElementById("overlay");
	const bioLink = document.querySelector(".bio-link");
	const cvLink = overlay.querySelector(".cv");

	if (bioLink && overlay) {
		bioLink.addEventListener("click", function (e) {
			e.preventDefault();
			overlay.classList.toggle("active");
		});

		overlay.addEventListener("click", function (e) {
			// If the click target is the overlay or any of its children
			if (!cvLink.contains(e.target)) {
				overlay.classList.remove("active");
			}
		});
	}
});
