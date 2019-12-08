(() => {
    const start = 240920;
    const end = 789857;

    console.log(countNumberOfValidPasswords());

    console.log(isValidPassword("112233"));
    console.log(isValidPassword("123444"));
    console.log(isValidPassword("111122"));
    console.log(isValidPassword("1111223333"));

    function countNumberOfValidPasswords() {
        let count = 0;
        for (let i = start; i <= end; i += 1) {
            if (isValidPassword(i.toString())) {
                count += 1;
            }
        }
        return count;
    }

    function isValidPassword(pwd) {
        const rules = [
            hasValidLength,
            // hasTwoSimilarAdjacentDigits,
            hasTwoSimilarAdjacentDigitsNotPartOfTheGroup,
            hasNeverDecreasingDigits,
        ];

        for (const rule of rules) {
            if (!rule(pwd)) return false;
        }
        return true;
    }

    function hasValidLength(pwd) {
        return pwd && pwd.length === 6
    }

    function hasTwoSimilarAdjacentDigits(pwd) {
        for (let i = 1; i < pwd.length; i++) {
            if (pwd[i - 1] === pwd[i]) return true;
        }
        return false;
    }

    function hasTwoSimilarAdjacentDigitsNotPartOfTheGroup(pwd) {
        let prev = pwd[0];
        let hasTwoDigiits = false;
        for (let i = 1; i < pwd.length; i++) {
            let count = 1;
            while(pwd[i] === prev) {
                count++;
                i++;
            }
            if (count === 2) hasTwoDigiits = true;
            prev = pwd[i];
        }
        return hasTwoDigiits;
    }

    function hasNeverDecreasingDigits(pwd) {
        for (let i = 1; i < pwd.length; i++) {
            if (Number(pwd[i - 1]) > Number(pwd[i])) return false;
        }
        return true;
    }
})()
