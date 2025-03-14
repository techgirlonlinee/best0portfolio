document.addEventListener("DOMContentLoaded", function () {
	const overlay = document.getElementById("overlay");
	const bioLink = document.querySelector(".bio-link");

	if (bioLink && overlay) {
		bioLink.addEventListener("click", function (e) {
			e.preventDefault();
			overlay.classList.toggle("active");
		});
	}
});
