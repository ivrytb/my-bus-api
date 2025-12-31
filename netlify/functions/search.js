exports.handler = async (event) => {
    try {
        const cityKey = event.queryStringParameters.city_key || "";
        const cities = ["בני ברק", "ביתר עילית", "בית שמש", "אלעד", "ירושלים", "צפת", "רחובות"];
        
        const keyMap = {
            '2': ['א', 'ב', 'ג'], '3': ['ד', 'ה', 'ו'], '4': ['ז', 'ח', 'ט'],
            '5': ['י', 'כ', 'ל'], '6': ['מ', 'נ'], '7': ['ס', 'ע', 'פ'],
            '8': ['צ', 'ק', 'ר'], '9': ['ש', 'ת']
        };

        const digit = cityKey.toString().trim().charAt(0);
        const possibleLetters = keyMap[digit];

        if (!possibleLetters) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-המקש אינו תקין, נא נסה שנית=city_key,no,1,1,7,Digits"
            };
        }

        const filteredCities = cities.filter(city => 
            possibleLetters.some(letter => city.startsWith(letter))
        );

        if (filteredCities.length === 0) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-לא נמצאו ערים, נא נסה מקש אחר=city_key,no,1,1,7,Digits"
            };
        }

        // בניית רשימת הערים להקראה
        let cityList = "";
        filteredCities.slice(0, 5).forEach((city, index) => {
            cityList += `ל${city} הקש ${index + 1}, `;
        });

        // המבנה לפי המסמך: read=חלק ראשון (הקראה)=חלק שני (הגדרת הקשה)
        // שם הפרמטר לבחירת העיר יהיה: selected_city
        const responseBody = `read=t-לבחירת עיר, ${cityList}=selected_city,no,1,1,7,Digits`;

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: responseBody
        };

    } catch (error) {
        return {
            statusCode: 200,
            body: "read=t-חלה שגיאה=city_key,no,1,1,7,Digits"
        };
    }
};
