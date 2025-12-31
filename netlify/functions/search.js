exports.handler = async (event) => {
    try {
        // ימות המשיח שולחים כעת את הפרמטר city_key כפי שהגדרנו ב-api_000
        const cityKey = event.queryStringParameters.city_key || "";
        
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

        const cities = ["בני ברק", "ביתר עילית", "בית שמש", "אלעד", "ירושלים", "צפת", "רחובות"];

        // ניקוי הקלט
        const digit = cityKey.toString().trim().charAt(0);
        
        if (!digit) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-לא התקבלה הקשה, נא נסה שנית"
            };
        }

        const possibleLetters = keyMap[digit];

        if (!possibleLetters) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-המקש שהוקש אינו תקין, נא נסה שוב"
            };
        }

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

        let message = "לבחירת עיר, ";
        filteredCities.forEach((city, index) => {
            message += `ל${city} הקש ${index + 1}, `;
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
            body: "read=t-שגיאה במעבד הנתונים"
        };
    }
};
