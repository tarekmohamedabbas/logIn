// الطلاب وبيانات الحضور
const studentsDatabase = [
    { id: "123", name: "أحمد", email: "ahmed@example.com" },
    { id: "124", name: "محمود", email: "mahmoud@example.com" },
    { id: "125", name: "مريم", email: "mariam@example.com" },
    { id: "126", name: "سارة", email: "sarah@example.com" }
];
function displayAttendanceAndDeparture(day) {
    const attendanceMessage = document.getElementById('attendanceMessage');
    const dayAttendance = attendanceData[day];

    if (dayAttendance && dayAttendance.length > 0) {
        let attendanceList = `<h3>الحضور والانصراف ليوم ${day}</h3><ul>`;
        dayAttendance.forEach(student => {
            const statusClass = student.status === 'حضور' ? 'present' : 'absent';
            const statusText = student.status === 'حضور' ? 'حضور' : 'غائب';
            const departureTime = student.departureTime ? `<span class="departureTime"> - انصراف في الساعة ${student.departureTime}</span>` : '';
            attendanceList += `
                <li>
                    <span class="name">${student.name} (${student.id})</span>
                    <span class="time"> - وقت التسجيل: ${student.time}</span>
                    <span class="status ${statusClass}">${statusText}</span>
                    ${departureTime}
                </li>
            `;
        });
        attendanceList += `</ul>`;
        attendanceMessage.innerHTML = attendanceList;
    } else {
        attendanceMessage.innerHTML = `<p>لا يوجد حضور أو انصراف لهذا اليوم.</p>`;
    }
}

// بيانات الحضور والانصراف
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

// دالة لعرض الإشعار المنبثق
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // اختفاء الإشعار بعد 3 ثوانٍ
}

// دالة لتحديث الجدول
function updateAttendanceTable(day, studentId, studentName, time, status) {
    const tableBody = document.getElementById(`${day}TableBody`);

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${studentName}</td>
        <td>${studentId}</td>
        <td>${time}</td>
        <td class="${status === 'حضور' ? 'green' : 'red'}">${status}</td>
    `;

    tableBody.appendChild(row);
}

// دالة لعرض الحضور والانصراف في نفس اليوم
function displayAttendanceAndDeparture(day) {
    const attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
    const dayAttendance = attendanceData[day];
    const attendanceMessage = document.getElementById('attendanceMessage');

    if (!dayAttendance || dayAttendance.length === 0) {
        attendanceMessage.innerHTML = `<p>لا يوجد حضور أو انصراف لهذا اليوم.</p>`;
        return;
    }

    let attendanceList = `<h3>الحضور والانصراف ليوم ${day}</h3><ul>`;
    dayAttendance.forEach(student => {
        const statusClass = student.status === 'حضور' ? 'green' : 'red';
        const statusText = student.status === 'حضور' ? 'حضور' : 'غائب';
        const departureTime = student.departureTime ? ` - انصراف في الساعة ${student.departureTime}` : '';
        attendanceList += `
            <li>
                ${student.name} (${student.id}) - وقت التسجيل: ${student.time}${departureTime} - 
                <span class="${statusClass}">${statusText}</span>
            </li>
        `;
    });
    attendanceList += `</ul>`;
    attendanceMessage.innerHTML = attendanceList;
}

// التعامل مع عرض الحضور والانصراف لكل يوم
['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
    document.getElementById(day)?.addEventListener('click', function() {
        displayAttendanceAndDeparture(day.charAt(0).toUpperCase() + day.slice(1));
    });
});

// زر تجديد بيانات اليوم
document.getElementById('resetData')?.addEventListener('click', function() {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    const confirmation = confirm(`هل أنت متأكد من تجديد البيانات لهذا اليوم (${today})؟`);
    
    if (confirmation) {
        const attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
        attendanceData[today] = []; // مسح بيانات الحضور والانصراف
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
        
        alert(`تم مسح بيانات اليوم (${today}) بنجاح.`);
        displayAttendanceAndDeparture(today); // إعادة تحميل الحضور والانصراف بعد التجديد
    }
});

// زر تحميل البيانات كـ CSV
document.getElementById('downloadData')?.addEventListener('click', function() {
    const attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
    
    if (!attendanceData || Object.keys(attendanceData).length === 0) {
        alert('لا توجد بيانات لتصديرها.');
        return;
    }

    let csvContent = "يوم,الاسم,الـ ID,وقت التسجيل,الحالة\n";

    function escapeCsvValue(value) {
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }

    for (let day in attendanceData) {
        attendanceData[day].forEach(student => {
            csvContent += `${escapeCsvValue(day)},${escapeCsvValue(student.name)},${escapeCsvValue(student.id)},${escapeCsvValue(student.time)},${escapeCsvValue(student.status)}\n`;
        });
    }

    const bom = "\uFEFF"; // لإصلاح الترميز العربي
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'attendance_and_departure.csv';
    link.click();
});




// style
// الحصول على الكائن الذي سيتبع الماوس
const cursor = document.querySelector('.cursor');

// تعقب حركة الماوس
document.addEventListener('mousemove', (e) => {
    const mouseX = e.pageX;
    const mouseY = e.pageY;

    // تحديث موقع الكائن (الدائرة) ليتبع الماوس
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    
    // إضافة class لإضاءة الكائن فقط عند مرور الماوس
    document.body.classList.add('mouse-over');
});

// إزالة التأثير بعد توقف الماوس عن الحركة
document.addEventListener('mouseleave', () => {
    document.body.classList.remove('mouse-over');
});

document.querySelectorAll('.circle').forEach(circle => {
    const randomTop = Math.random() * 100;  // موقع عشوائي أفقي
    const randomLeft = Math.random() * 100; // موقع عشوائي عمودي
    const randomDelay = Math.random() * 5;  // تأخير عشوائي للحركة
    circle.style.top = `${randomTop}vh`;  // تعيين الموقع العمودي
    circle.style.left = `${randomLeft}vw`;  // تعيين الموقع الأفقي
    circle.style.animationDelay = `${randomDelay}s`;  // تأخير العداد العشوائي
});

// إنشاء الشهب بشكل عشوائي في الموقع
for (let i = 0; i < 50; i++) {  // تحديد عدد الشهب
    let snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = Math.random() * 100 + 'vw';  // وضع الشهب في مواقع عشوائية
    snowflake.style.animationDuration = Math.random() * 5 + 5 + 's';  // تعيين سرعة الحركة بشكل عشوائي
    snowflake.style.animationDelay = Math.random() * 5 + 's';  // تأخير عشوائي للحركة
    document.body.appendChild(snowflake);
}


// تغيير الحاله 

toggleButton.addEventListener('click', function() {
    // عرض نافذة لطلب كلمة المرور
    const password = prompt("يرجى إدخال كلمة المرور لتغيير الحالة:");

    // كلمة المرور المحددة
    const correctPassword = "1233";  // هنا يمكنك تغيير كلمة المرور كما تشاء

    // التحقق من كلمة المرور
    if (password === correctPassword) {
        // تغيير حالة الطالب في الذاكرة
        student.status = student.status === 'present' ? 'absent' : 'present';
        // تحديث localStorage
        localStorage.setItem('attendance', JSON.stringify(attendanceData));
        // تحديث النص ولون الخلية
        statusCell.textContent = student.status === 'present' ? 'حضر' : 'غاب';
        statusCell.classList.toggle('green');
        statusCell.classList.toggle('red');
    } else {
        // إذا كانت كلمة المرور غير صحيحة
        alert("كلمة المرور غير صحيحة. لا يمكن تغيير الحالة.");
    }
});
