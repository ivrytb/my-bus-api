exports.handler = async (event) => {
    try {
        let params = {};
        if (event.body) {
            const bodyStr = event.body;
            const pairs = bodyStr.split('&');
            for (let pair of pairs) {
                const [key, value] = pair.split('=');
                params[key] = decodeURIComponent(value || "");
            }
        }

        // 1. בדיקה האם הגענו משלב בחירת העיר הספציפית
        if (params.city_selection) {
            const selectedIndex = params.city_selection; // למשל '1' או '2'
            // כאן בהמשך נשמור את העיר שנבחרה ונציג קווים. כרגע נחזיר הודעת אישור:
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: `id_list_message=t-בחרת את עיר מספר ${selectedIndex} בהצלחה&go_to_folder=/1`
            };
        }

        // 2. לוגיקת בחירת האות (הקוד הקיים שלך)
        const cityKey = params.city_key || "";
        const digit = cityKey.replace(/\D/g, '').charAt(0);
        
        const keyMap = {
            '2': ['א', 'ב', 'ג'], '3': ['ד', 'ה', 'ו'], '4': ['ז', 'ח', 'ט'],
            '5': ['י', 'כ', 'ל'], '6': ['מ', 'נ'], '7': ['ס', 'ע', 'פ'],
            '8': ['צ', 'ק', 'ר'], '9': ['ש', 'ת']
        };

        const cities = ["אלעד", "אשדוד", "בני ברק", "ביתר עילית", "בית שמש", "דימונה", "הדר גנים", "חריש", "חיפה", "טבריה", "ירושלים", "מודיעין עילית", "נתיבות", "צפת", "רכסים"];

        if (digit && keyMap[digit]) {
            const possibleLetters = keyMap[digit];
            const filteredCities = cities.filter(city => possibleLetters.some(letter => city.startsWith(letter)));

            if (filteredCities.length > 0) {
                let cityList = "";
                filteredCities.slice(0, 5).forEach((city, index) => {
                    cityList += `ל${city} הקש ${index + 1} `;
                });

                // אנחנו שולחים את המשתמש לשלב הבא עם הפרמטר city_selection
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "text/plain; charset=utf-8" },
                    body: `read=t-לבחירת עיר ${cityList}=city_selection,no,1,1,7,Digits`
                };
            }
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "read=t-לא נמצאו ערים מתאימות נא הקש מקש אחר=city_key,no,1,1,7,Digits"
        };

    } catch (error) {
        return { statusCode: 200, body: "read=t-תקלה בשרת=city_key,no,1,1,7,Digits" };
    }
};
