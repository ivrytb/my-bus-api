exports.handler = async (event) => {
    try {
        let cityKey = "";

        // פירוק ידני לגמרי של ה-Body כדי למנוע קריסות
        if (event.body) {
            const bodyStr = event.body; // נראה בערך ככה: city_key=2&ApiCallId=...
            const pairs = bodyStr.split('&');
            for (let pair of pairs) {
                const [key, value] = pair.split('=');
                if (key === 'city_key') {
                    cityKey = decodeURIComponent(value || "");
                    break;
                }
            }
        }

        // ניקוי: לוקח רק את הספרה הראשונה
        const digit = cityKey.replace(/\D/g, '').charAt(0);

        // אם המשתמש הקיש 2 (או כל מקש אחר שתבחר)
        if (digit) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: `read=t-הקשת את המקש ${digit}. התקשורת עובדת בהצלחה=selected_city,no,1,1,1,Digits`
            };
        }

        // מקרה שלא הוקש כלום או שגיאה בזיהוי
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "read=t-לא זוהתה הקשה. נא הקש שוב=city_key,no,1,1,1,Digits"
        };

    } catch (error) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "read=t-חלה שגיאה פנימית=city_key,no,1,1,1,Digits"
        };
    }
};
