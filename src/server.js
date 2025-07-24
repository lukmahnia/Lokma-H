const express = require('express');
const app = express();
const port = 3000;
const db = require('./database.js');

app.use(express.json());
app.use(express.static('public'));

// API routes

// Users API
app.get('/api/users', (req, res) => {
    db.all("SELECT id, name, email, phone, address, notes, loyalty_points, last_order FROM users", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

app.post('/api/users', (req, res) => {
    const { name, email, phone, address, notes } = req.body;
    db.run(`INSERT INTO users (name, email, phone, address, notes) VALUES (?,?,?,?,?)`,
        [name, email, phone, address, notes], 
        function(err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({ id: this.lastID })
        });
});

app.put('/api/users/:id', (req, res) => {
    const { name, email, phone, address, notes } = req.body;
    db.run(`UPDATE users set name = ?, email = ?, phone = ?, address = ?, notes = ? WHERE id = ?`,
        [name, email, phone, address, notes, req.params.id],
        function(err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({ message: "success" })
        });
});

app.delete('/api/users/:id', (req, res) => {
    db.run(`DELETE FROM users WHERE id = ?`, req.params.id, function(err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({ message: "success" })
    });
});

// Orders API
app.get('/api/orders', (req, res) => {
    db.all(`SELECT o.id, u.name as user_name, o.total_price, o.status 
            FROM orders o
            JOIN users u ON u.id = o.user_id`,
        [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

app.put('/api/orders/:id', (req, res) => {
    const { status } = req.body;
    db.run(`UPDATE orders set status = ? WHERE id = ?`, [status, req.params.id], function(err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({ message: "success" })
    });
});

app.delete('/api/orders/:id', (req, res) => {
    db.run(`DELETE FROM orders WHERE id = ?`, req.params.id, function(err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        // Also delete associated order_items
        db.run(`DELETE FROM order_items WHERE order_id = ?`, req.params.id);
        res.json({ message: "success" })
    });
});


// Menu API
app.get('/api/menu', (req, res) => {
    db.all("SELECT * FROM menu", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

app.post('/api/menu', (req, res) => {
    const { name, price, description, image } = req.body;
    db.run(`INSERT INTO menu (name, price, description, image) VALUES (?,?,?,?)`,
        [name, price, description, image], 
        function(err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({ id: this.lastID })
        });
});

app.put('/api/menu/:id', (req, res) => {
    const { name, price, description, image } = req.body;
    db.run(`UPDATE menu set name = ?, price = ?, description = ?, image = ? WHERE id = ?`,
        [name, price, description, image, req.params.id],
        function(err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({ message: "success" })
        });
});

app.delete('/api/menu/:id', (req, res) => {
    db.run(`DELETE FROM menu WHERE id = ?`, req.params.id, function(err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({ message: "success" })
    });
});

// Offers API
app.get('/api/offers', (req, res) => {
    db.all("SELECT * FROM offers", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

app.post('/api/offers', (req, res) => {
    const { name, price, description, image } = req.body;
    db.run(`INSERT INTO offers (name, price, description, image) VALUES (?,?,?,?)`,
        [name, price, description, image], 
        function(err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({ id: this.lastID })
        });
});

app.put('/api/offers/:id', (req, res) => {
    const { name, price, description, image } = req.body;
    db.run(`UPDATE offers set name = ?, price = ?, description = ?, image = ? WHERE id = ?`,
        [name, price, description, image, req.params.id],
        function(err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({ message: "success" })
        });
});

app.delete('/api/offers/:id', (req, res) => {
    db.run(`DELETE FROM offers WHERE id = ?`, req.params.id, function(err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({ message: "success" })
    });
});

// Promotions API
app.get('/api/promotions', (req, res) => {
    db.all("SELECT * FROM promotions", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

app.post('/api/promotions', (req, res) => {
    const { name, description, discount_percentage, start_date, end_date, applicable_items } = req.body;
    db.run(`INSERT INTO promotions (name, description, discount_percentage, start_date, end_date, applicable_items) VALUES (?,?,?,?,?,?)`,
        [name, description, discount_percentage, start_date, end_date, applicable_items], 
        function(err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({ id: this.lastID })
        });
});

app.put('/api/promotions/:id', (req, res) => {
    const { name, description, discount_percentage, start_date, end_date, applicable_items } = req.body;
    db.run(`UPDATE promotions set name = ?, description = ?, discount_percentage = ?, start_date = ?, end_date = ?, applicable_items = ? WHERE id = ?`,
        [name, description, discount_percentage, start_date, end_date, applicable_items, req.params.id],
        function(err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({ message: "success" })
        });
});

app.delete('/api/promotions/:id', (req, res) => {
    db.run(`DELETE FROM promotions WHERE id = ?`, req.params.id, function(err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({ message: "success" })
    });
});


// Subscriptions API
app.get('/api/subscriptions', (req, res) => {
    db.all("SELECT * FROM subscriptions", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

app.post('/api/subscriptions', (req, res) => {
    const { name, price, description, meals_per_week, delivery_days } = req.body;
    db.run(`INSERT INTO subscriptions (name, price, description, meals_per_week, delivery_days) VALUES (?,?,?,?,?)`,
        [name, price, description, meals_per_week, delivery_days], 
        function(err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({ id: this.lastID })
        });
});

app.put('/api/subscriptions/:id', (req, res) => {
    const { name, price, description, meals_per_week, delivery_days } = req.body;
    db.run(`UPDATE subscriptions set name = ?, price = ?, description = ?, meals_per_week = ?, delivery_days = ? WHERE id = ?`,
        [name, price, description, meals_per_week, delivery_days, req.params.id],
        function(err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({ message: "success" })
        });
});

app.delete('/api/subscriptions/:id', (req, res) => {
    db.run(`DELETE FROM subscriptions WHERE id = ?`, req.params.id, function(err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({ message: "success" })
    });
});

app.get('/api/user_subscriptions', (req, res) => {
    db.all(`SELECT u.name as user_name, s.name as subscription_name, us.start_date, us.end_date 
            FROM user_subscriptions us
            JOIN users u ON u.id = us.user_id
            JOIN subscriptions s ON s.id = us.subscription_id`,
        [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});


// Healthy Meals API
app.get('/api/healthy-meals', (req, res) => {
    db.all("SELECT * FROM healthy_meals", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

app.post('/api/healthy-meals', (req, res) => {
    const { name, price, description, image, calories, diet_type } = req.body;
    db.run(`INSERT INTO healthy_meals (name, price, description, image, calories, diet_type) VALUES (?,?,?,?,?,?)`,
        [name, price, description, image, calories, diet_type], 
        function(err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({ id: this.lastID })
        });
});

app.put('/api/healthy-meals/:id', (req, res) => {
    const { name, price, description, image, calories, diet_type } = req.body;
    db.run(`UPDATE healthy_meals set name = ?, price = ?, description = ?, image = ?, calories = ?, diet_type = ? WHERE id = ?`,
        [name, price, description, image, calories, diet_type, req.params.id],
        function(err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({ message: "success" })
        });
});

app.delete('/api/healthy-meals/:id', (req, res) => {
    db.run(`DELETE FROM healthy_meals WHERE id = ?`, req.params.id, function(err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({ message: "success" })
    });
});


// Business Meals API
app.get('/api/business-meals', (req, res) => {
    db.all("SELECT * FROM business_meals", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

app.post('/api/business-meals', (req, res) => {
    const { name, price, description, image, people_count } = req.body;
    db.run(`INSERT INTO business_meals (name, price, description, image, people_count) VALUES (?,?,?,?,?)`,
        [name, price, description, image, people_count], 
        function(err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({ id: this.lastID })
        });
});

app.put('/api/business-meals/:id', (req, res) => {
    const { name, price, description, image, people_count } = req.body;
    db.run(`UPDATE business_meals set name = ?, price = ?, description = ?, image = ?, people_count = ? WHERE id = ?`,
        [name, price, description, image, people_count, req.params.id],
        function(err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({ message: "success" })
        });
});

app.delete('/api/business-meals/:id', (req, res) => {
    db.run(`DELETE FROM business_meals WHERE id = ?`, req.params.id, function(err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({ message: "success" })
    });
});


// Reports API
app.get('/api/reports/sales-analysis', (req, res) => {
    db.get("SELECT SUM(total_price) as total_sales, COUNT(id) as total_orders FROM orders", [], (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(row)
    });
});

app.get('/api/reports/best-selling-items', (req, res) => {
    db.all(`SELECT m.name, SUM(oi.quantity) as quantity_sold
            FROM order_items oi
            JOIN menu m ON m.id = oi.item_id AND oi.item_type = 'menu'
            GROUP BY m.name
            ORDER BY quantity_sold DESC
            LIMIT 5`,
        [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

app.get('/api/reports/premium-customers', (req, res) => {
    db.all(`SELECT u.name, u.email, SUM(o.total_price) as total_spent
            FROM orders o
            JOIN users u ON u.id = o.user_id
            GROUP BY u.id
            ORDER BY total_spent DESC
            LIMIT 5`,
        [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});


// Settings API
app.get('/api/settings', (req, res) => {
    db.get("SELECT * FROM settings WHERE id = 1", [], (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(row)
    });
});

app.post('/api/settings', (req, res) => {
    const { working_hours, delivery_companies, payment_settings } = req.body;
    db.run(`UPDATE settings SET working_hours = ?, delivery_companies = ?, payment_settings = ? WHERE id = 1`,
        [working_hours, delivery_companies, payment_settings],
        function(err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({ message: "success" })
        });
});

// Login API
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        if (row) {
            res.json({ message: "success", userId: row.id })
        } else {
            res.status(401).json({ "error": "Invalid credentials" });
        }
    });
});

// Register API
app.post('/api/register', (req, res) => {
    const { name, email, password, phone } = req.body;
    db.run(`INSERT INTO users (name, email, password, phone) VALUES (?,?,?,?)`,
        [name, email, password, phone], 
        function(err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({ id: this.lastID })
        });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
