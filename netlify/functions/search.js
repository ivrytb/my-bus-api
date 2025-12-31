exports.handler = async (event) => {
    try {
        // חילוץ נתונים בצורה בטוחה ללא ספריות חיצוניות
        let cityKey = "";
        
        if (event.body) {
            // פענוח POST body
            const bodyParams = new URLSearchParams(event.body);
            cityKey = bodyParams.get('city_key') || "";
        } else if (event.queryStringParameters) {
            // פענוח GET
            cityKey = event.queryStringParameters.city_key || "";
        }

        // ניקוי הספרה (השארת מספרים בלבד)
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

        const cities = [
            "אלעד", "אשדוד", "בני ברק", "ביתר עילית", "בית שמש", 
            "דימונה", "הדר גנים", "חריש", "חיפה", "טבריה", 
            "ירושלים", "כפר חב"ד", "מודיעין עילית", "נתיבות", 
            "סביון", "עמנואל", "צפת", "קרית גת", "רכסים", "תל אביב"
        ];

        // אם אין מקש או מקש לא תקין - נבקש שוב
        if (!digit || !keyMap[digit]) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-נא הקש שוב את המקש המבוקש=city_key,no,1,1,7,Digits"
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

        let cityList = "";
        filteredCities.slice(0, 5).forEach((city, index) => {
            cityList += `ל${city} הקש ${index + 1} `;
        });

        // יצירת התגובה בפורמט read פשוט ורציף
        const responseText = `read=t-לבחירת עיר ${cityList}=selected_city,no,1,1,7,Digits`;

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: responseText
        };

    } catch (error) {
        // במקרה של שגיאה, נחזיר תגובה תקינה כדי שהמערכת לא תנתק
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "read=t-חלה שגיאה בשרת=city_key,no,1,1,7,Digits"
        };
    }
};
