const querystring = require('querystring');

exports.handler = async (event) => {
    try {
        // 1. חילוץ הנתונים - בודק גם ב-URL (GET) וגם ב-Body (POST)
        let params = event.queryStringParameters || {};
        
        if (event.body) {
            const bodyParams = querystring.parse(event.body);
            params = { ...params, ...bodyParams };
        }

        const cityKey = params.city_key || "";
        
        // 2. מפת המקשים
        const keyMap = {
            '2': ['א', 'ב', 'ג'], '3': ['ד', 'ה', 'ו'], '4': ['ז', 'ח', 'ט'],
            '5': ['י', 'כ', 'ל'], '6': ['מ', 'נ'], '7': ['ס', 'ע', 'פ'],
            '8': ['צ', 'ק', 'ר'], '9': ['ש', 'ת']
        };

        const cities = ["בני ברק", "ביתר עילית", "בית שמש", "אלעד", "ירושלים", "צפת", "רחובות"];

        // ניקוי הקלט (לוקח רק את הספרה הראשונה)
        const digit = cityKey.toString().trim().charAt(0);

        // 3. לוגיקת התגובה
        if (!digit || !keyMap[digit]) {
            // אם הגענו לכאן, סימן שהשרת לא קיבל את המקש בצורה נכונה
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
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-לא נמצאו ערים מתאימות למקש זה, נא נסה שוב=city_key,no,1,1,7,Digits"
            };
        }

        let cityList = "";
        filteredCities.slice(0, 5).forEach((city, index) => {
            cityList += `ל${city} הקש ${index + 1}, `;
        });

        // החלק החשוב: שימוש ב-read לפי המסמך שלך
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
