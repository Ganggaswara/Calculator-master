$(document).ready(function() {
    const sunIcon = "assets/SunIcon.svg";
    const moonIcon = "assets/MoonIcon.svg";
    const $themeIcon = $("#theme-icon");
    const $githubIcon = $("#github-icon");
    const $result = $("#result");
    const $toast = $("#toast");

    $("#clear-button").on("click", function() {
        $result.val("");
    });

    // Add click handler for equals button
    window.calculate = function() {
        calculate($result.val());
    };

    $("input[value='=']").on("click", function() {
        calculate($result.val());
    });

    function calculate(value) {
        try {
            value = value.replace(/[+\-*/]$/, '');
            
            // Validate input before calculation
            if (!value || value.match(/[^0-9+\-*/.\s]/g)) {
                throw new Error("Invalid input");
            }

            // Safely evaluate the expression
            const calculatedValue = Function('"use strict";return (' + value + ')')();
            
            if (isNaN(calculatedValue) || !isFinite(calculatedValue)) {
                throw new Error("Invalid calculation");
            }

            const formattedResult = Number.isInteger(calculatedValue) 
                ? calculatedValue 
                : Number(calculatedValue.toFixed(8));
            
            $result.val(formattedResult);
        } catch (error) {
            $result.val("Error");
            setTimeout(() => {
                $result.val("");
            }, 1300);
        }
    }

    // Toggles dark mode using Tailwind's 
    window.changeTheme = function() {
        const $html = $('html');
        setTimeout(() => {
            $toast.html("Calculator");
        }, 1500);
        
        if ($html.hasClass('dark')) {
            // Switch to light mode
            $html.removeClass('dark');
            $themeIcon.attr("src", moonIcon);
            $githubIcon.attr("src", "assets/GitHubDark.svg");
            $toast.html("Light Mode ☀️");
        } else {
            // Switch to dark mode
            $html.addClass('dark');
            $themeIcon.attr("src", sunIcon);
            $githubIcon.attr("src", "assets/GitHubLight.svg");
            $toast.html("Dark Mode 🌙");
        }
    }

    // Displays entered value on screen.
    window.liveScreen = function(enteredValue) {
        let currentVal = $result.val();
        
        if (enteredValue === "." && currentVal.includes(".")) {
            return;
        }
        
        if ("+-*/".includes(enteredValue) && "+-*/".includes(currentVal.slice(-1))) {
            return;
        }

        if (!currentVal) {
            currentVal = "";
        }
        
        $result.val(currentVal + enteredValue);
    }

    // Handle keyboard inputs
    $(document).on('keydown', function(e) {
        e.preventDefault();

        const key = e.key;
        const numbers = "0123456789";
        const operators = "+-*/";
        const currentVal = $result.val();

        // Handle numbers
        if (numbers.includes(key)) {
            liveScreen(key);
        }

        // Handle operators
        if (operators.includes(key)) {
            if (currentVal) {
                liveScreen(key);
            }
        }

        // Handle decimal
        if (key === ".") {
            // Prevent multiple decimal points in the same number
            if (!currentVal.includes(".")) {
                liveScreen(".");
            }
        }

        // Handle enter
        if (key === "Enter") {
            calculate($result.val());
        }

        // Handle backspace
        if (key === "Backspace") {
            const resultInput = $result.val();
            $result.val(resultInput.substring(0, resultInput.length - 1));
        }
        
        // Handle escape key to clear
        if (key === "Escape") {
            $result.val("");
        }
    });
});
