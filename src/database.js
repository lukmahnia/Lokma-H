const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, 
            email TEXT UNIQUE, 
            password TEXT, 
            phone TEXT UNIQUE,
            address TEXT,
            notes TEXT,
            loyalty_points INTEGER DEFAULT 0,
            last_order TEXT,
            CONSTRAINT email_unique UNIQUE (email),
            CONSTRAINT phone_unique UNIQUE (phone)
            )`, (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, check if admin user exists, if not, create it
                db.get("SELECT COUNT(*) AS count FROM users WHERE email = ?", ["admin@example.com"], (err, row) => {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    if (row.count === 0) {
                        const insert = 'INSERT INTO users (name, email, password, phone, address, notes) VALUES (?,?,?,?,?,?)'
                        db.run(insert, ["admin","admin@example.com","admin123","782030088", "Admin Address", "Admin Notes"])
                        db.run(insert, ["أحمد علي", "ahmed@example.com", "pass123", "777111222", "صنعاء", ""]);
                        db.run(insert, ["فاطمة محمد", "fatima@example.com", "pass123", "777333444", "عدن", ""]);
                        db.run(insert, ["خالد عبدالله", "khaled@example.com", "pass123", "777555666", "تعز", ""]);
                    }
                });
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            price text, 
            image text, 
            description text
            )`, (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                const insert = 'INSERT INTO menu (name, price, image, description) VALUES (?,?,?,?)'
                db.run(insert, ["عقده دجاج","1700 ر.ي","./img/عقده دجاج.jpg","عقده دجاج + خبز طاوه +صوص الطحينيه"])
                db.run(insert, ["رز مع العدس و سمك","2700 ر.ي","./img/رز مع العدس.jpg","رز مع العدس +سمك+ مطفاية +سلطه  الجرجير والبنج"])
                db.run(insert, ["كفته","2100 ر.ي","./img/كفته بالباذنجان.jpg","كفته بالباذنجان والبطاط+ خبز طاوه او تنور +  صوص طحينيه"])
                db.run(insert, ["ورق عنب","1800 ر.ي","./img/ورق عنب.jpg",`ورق عنب`])
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS offers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            price text, 
            image text, 
            description text
            )`, (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                const insert = 'INSERT INTO offers (name, price, image, description) VALUES (?,?,?,?)'
                db.run(insert, ["عرض الغداء","27000 ر.ي","./img/11.jpg","وجبة غداء متكاملة (طبق رئيسي + سلطة + مشروب) بسعر خاص."])
                db.run(insert, ["عرض العائلة","7000 ر.ي","./img/22.jpg","3 بيتزا كبيرة + بطاطس عائلية + مشروب كبير."])
                db.run(insert, ["خصم 20% على الحلويات","","./img/24.jpg","استمتع بخصم 20% على جميع أنواع الحلويات."])
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            price text, 
            description text,
            meals_per_week INTEGER,
            delivery_days TEXT
            )`, (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                const insert = 'INSERT INTO subscriptions (name, price, description, meals_per_week, delivery_days) VALUES (?,?,?,?,?)'
                db.run(insert, ["الاشتراك الأسبوعي","75000 ر.ي","وجبات غداء لمدة 5 أيام في الأسبوع", 5, "الأحد,الإثنين,الثلاثاء,الأربعاء,الخميس"])
                db.run(insert, ["الاشتراك الشهري","300000 ر.ي","وجبات غداء لمدة 20 يوم في الشهر", 5, "الأحد,الإثنين,الثلاثاء,الأربعاء,الخميس"])
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS user_subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            subscription_id INTEGER,
            start_date TEXT,
            end_date TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (subscription_id) REFERENCES subscriptions (id)
            )`, (err) => {
            if (err) {
                // Table already created
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS healthy_meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            price text, 
            image text, 
            description text,
            calories INTEGER,
            diet_type TEXT
            )`, (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                const insert = 'INSERT INTO healthy_meals (name, price, image, description, calories, diet_type) VALUES (?,?,?,?,?,?)'
                db.run(insert, ["سلطة كينوا بالدجاج","3000 ر.ي","./img/10.jpg","سلطة غنية بالبروتين والألياف مع صدر دجاج مشوي وصلصة ليمون", 350, "weight_loss"])
                db.run(insert, ["سمك السلمون المشوي","3500 ر.ي","./img/3.jpg","قطعة سلمون مشوية مع خضار سوتيه وأرز أسمر", 450, "keto"])
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS business_meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            price text, 
            image text, 
            description text,
            people_count INTEGER
            )`, (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                const insert = 'INSERT INTO business_meals (name, price, image, description, people_count) VALUES (?,?,?,?,?)'
                db.run(insert, ["وجبة اجتماع عمل","2500 ر.ي","./img/ورق عنب.jpg","تشكيلة من المقبلات والساندويتشات والمشروبات تكفي 5 أشخاص", 5])
                db.run(insert, ["غداء عمل فاخر","5000 ر.ي","./img/مطفايه مع خبز طاوه.jpg","تشكيلة من الأطباق الرئيسية والسلطات والحلويات تكفي 10 أشخاص", 10])
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_price REAL,
            status TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
            )`, (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                const insert = 'INSERT INTO orders (user_id, total_price, status) VALUES (?,?,?)'
                db.run(insert, [2, 1500.0, "جديد"])
                db.run(insert, [3, 850.0, "قيد التوصيل"])
                db.run(insert, [4, 1000.0, "مكتمل"])
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            item_id INTEGER,
            item_type TEXT,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY (order_id) REFERENCES orders (id)
        )`, (err) => {
            if (err) {
                // Table already created
            } else {
                // Example of inserting order items
                const insert = 'INSERT INTO order_items (order_id, item_id, item_type, quantity, price) VALUES (?,?,?,?,?)';
                // Items for order 1
                db.run(insert, [1, 1, 'menu', 1, 700]);
                db.run(insert, [1, 2, 'menu', 1, 800]);
                 // Items for order 2
                db.run(insert, [2, 1, 'healthy_meals', 1, 955]);
                 // Items for order 3
                db.run(insert, [3, 1, 'business_meals', 1, 800]);
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            working_hours TEXT,
            delivery_companies TEXT,
            payment_settings TEXT
            )`, (err) => {
            if (err) {
                // Table already created
            }else{
                // Insert a default row for settings
                const insert = 'INSERT INTO settings (working_hours, delivery_companies, payment_settings) VALUES (?,?,?)'
                db.run(insert, ["من 11 صباحًا إلى 7 مساءً", "Uber Eats, Talabat", "Stripe API Key: sk_test_..."])
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS promotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            discount_percentage INTEGER,
            start_date TEXT,
            end_date TEXT,
            applicable_items TEXT
            )`, (err) => {
            if (err) {
                // Table already created
            }
        });
    }
});

module.exports = db
