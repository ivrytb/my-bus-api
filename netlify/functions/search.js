const querystring = require('querystring');

exports.handler = async (event) => {
    try {
        let params = event.queryStringParameters || {};
        if (event.body) {
            const bodyParams = querystring.parse(event.body);
            params = { ...params, ...bodyParams };
        }

        let cityKey = params.city_key || "";
        const digit = cityKey.toString().replace(/\D/g, '').charAt(0); 

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

        // רשימת ערים מורחבת כדי שכל מקש ימצא משהו
        const cities = [
            "אלעד", "אשדוד", "בני ברק", "ביתר עילית", "בית שמש", 
            "דימונה", "הדר גנים", "חריש", "חיפה", "טבריה", 
            "ירושלים", "כפר חב"ד", "מודיעין עילית", "נתיבות", 
            "סביון", "עמנואל", "צפת", "קרית גת", "רכסים", "תל אביב"
        ];

        if (!digit || !keyMap[digit]) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-המקש לא תקין נא נסה שנית=city_key,no,1,1,7,Digits"
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
                body: `read=t-לא נמצאו ערים במקש ${digit} נא נסה שוב=city_key,no,1,1,7,Digits`
            };
        }

        // בניית רשימה נקייה ללא תווים מיוחדים
        let cityList = "";
        filteredCities.slice(0, 5).forEach((city, index) => {
            cityList += `ל${city} הקש ${index + 1} `; // הורדתי פסיקים כדי למנוע בעיות ב-read
        });

        // חשוב מאוד: החלק של ה-read חייב להיות רציף
        const responseText = `read=t-לבחירת עיר ${cityList}=selected_city,no,1,1,7,Digits`;

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: responseText
        };

    } catch (error) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "read=t-שגיאה בשרת נסה שוב=city_key,no,1,1,7,Digits"
        };
    }
};
