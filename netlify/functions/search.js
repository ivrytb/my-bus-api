const querystring = require('querystring');

exports.handler = async (event) => {
    try {
        let params = event.queryStringParameters || {};
        if (event.body) {
            const bodyParams = querystring.parse(event.body);
            params = { ...params, ...bodyParams };
        }

        // חילוץ city_key וניקוי שלו מכל מה שאינו ספרה (כדי לטפל ב-"Digits-2")
        let cityKey = params.city_key || "";
        const digit = cityKey.toString().replace(/\D/g, '').charAt(0); 

        const keyMap = {
            '2': ['א', 'ב', 'ג'], '3': ['ד', 'ה', 'ו'], '4': ['ז', 'ח', 'ט'],
            '5': ['י', 'כ', 'ל'], '6': ['מ', 'נ'], '7': ['ס', 'ע', 'פ'],
            '8': ['צ', 'ק', 'ר'], '9': ['ש', 'ת']
        };

        const cities = ["בני ברק", "ביתר עילית", "בית שמש", "אלעד", "ירושלים", "צפת", "רחובות"];

        if (!digit || !keyMap[digit]) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-המקש שהוקש אינו תקין, נא נסה שנית=city_key,no,1,1,7,Digits"
            };
        }

        const possibleLetters = keyMap[digit];
        const filteredCities = cities.filter(city => 
            possibleLetters.some(letter => city.startsWith(letter))
        );

        if (filteredCities.length === 0) {
            // אם לא מצאנו, נשמיע למשתמש מה המערכת "הבינה" שהוא הקיש כדי שנוכל לדבג
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: `read=t-לא נמצאו ערים לאות שהקשתם במקש ${digit}, נא נסה שוב=city_key,no,1,1,7,Digits`
            };
        }

        let cityList = "";
        filteredCities.forEach((city, index) => {
            cityList += `ל${city} הקש ${index + 1}, `;
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: `read=t-לבחירת עיר, ${cityList}=selected_city,no,1,1,7,Digits`
        };

    } catch (error) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "read=t-חלה שגיאה בשרת=city_key,no,1,1,7,Digits"
        };
    }
};
