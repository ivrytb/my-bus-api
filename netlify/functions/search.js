exports.handler = async (event) => {
    // יצירת התשובה בפורמט של ימות המשיח
    const responseText = "read=t-שלום, המערכת מחוברת בהצלחה";

    return {
        statusCode: 200,
        // השורה הזו קריטית - היא אומרת לימות המשיח "זה טקסט פשוט, לא HTML"
        headers: { 
            "Content-Type": "text/plain; charset=utf-8" 
        },
        body: responseText
    };
};
