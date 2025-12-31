exports.handler = async (event) => {
    try {
        // מקבל את מה שהמשתמש הקיש בטלפון
        const data = event.queryStringParameters.data || "";
        
        // מפת האותיות (T9) - איזה מקש שייך לאילו אותיות
        const keyMap = {
            '2': ['א', 'ב', 'ג'],
            '3': ['ד', 'ה', 'ו'],
            '4': ['ז', 'ח', 'ט'],
            '5': ['י', 'כ', 'ל'],
            '6': ['מ', 'נ'],
            '7': ['ס', 'ע', 'פ'],
            '8': ['צ', 'ק', 'ר'],
            '9': ['ש', 'ת']
        };

        // רשימת ערים לדוגמה (בהמשך נחליף את זה בחיפוש אמיתי)
        const cities = ["בני ברק", "ביתר עילית", "בית שמש", "אלעד", "ירושלים", "צפת", "רחובות"];

        // אם המשתמש עוד לא הקיש כלום
        if (!data) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-נא הקש את המקש של האות הראשונה של עיר היעד"
            };
        }

        const digit = data[0];
        const possibleLetters = keyMap[digit];

        if (!possibleLetters) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-המקש שהוקש אינו תקין. נא נסה שוב"
            };
        }

        // סינון הערים שמתחילות באותיות המתאימות למקש
        const filteredCities = cities.filter(city => 
            possibleLetters.some(letter => city.startsWith(letter))
        );

        if (filteredCities.length === 0) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-לא נמצאו ערים מתאימות למקש זה"
            };
        }

        // בניית הודעה עם אפשרויות בחירה
        let message = "לבחירת עיר: ";
        filteredCities.slice(0, 5).forEach((city, index) => {
            message += `ל${city} הקש ${index + 1}. `;
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: `read=t-${message}`
        };

    } catch (error) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "read=t-חלה שגיאה במערכת"
        };
    }
};
