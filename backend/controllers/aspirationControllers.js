const { exec } = require("child_process");
const Student = require('../models/Student');
const Result = require("../models/InternshipResult");
const Aspiration = require("../models/Aspiration");
const { verifyToken } = require('./middlewareController');
const promiseController = {
    runcode: async (req, res) => {
        exec("python .\\algorithms\\demo.py", (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing the Python script: ${error}`);
            return res.status(500).send("Internal Server Error");
          }
    
          try {
            const jsonData = JSON.parse(stdout);
            res.json(jsonData);
          } catch (parseError) {
            console.error(`Error parsing JSON: ${parseError}`);
            res.send(stdout.replace(/\n/g, "<br>"));
          }
        });
    },
    //add kết quả thực tập cho mấy đứa thực tập ngoài, chỉ cần nhập id, tên vị trí và tên doanh nghiệp
    // mấy thuộc tính khác tự động được thêm nếu id valid
    add_result: async (req, res) => {
        try {
            const studentId = req.body.id;
            const existingStudent = await Student.findById(studentId).select('name birthday sex major -_id');
    
            if (!existingStudent) {
                return res.status(404).json({ error: 'Student not found', success: false });
            }
    
            const position = req.body.position;
            const business = req.body.business;
    
            // Extract selected attributes from the existing student
            const { name, birthday, sex, major } = existingStudent.toObject();
    
            await Result.create({
                _id: studentId,
                name,
                birthday,
                sex,
                major,
                position,
                business
            });
    
            res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error', details: err.message, success: false });
        }
    },

    get_result: async (req, res) => {
        try {
            const internshipResults = await Result.find();
            res.status(200).json(internshipResults);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
    add_aspiration : async (req, res) => {
        try {
            const studentId = req.account.id;
    
            if (!studentId) {
                return res.status(403).json("Student ID not available");
            }
    
            const { promised_positions } = req.body;
    
            if (!Array.isArray(promised_positions) || promised_positions.length !== 3) {
                return res.status(400).json("Exactly three promised positions are required");
            }
    
            // Find an existing promise for the student
            let existingPromise = await Aspiration.findById(studentId);
    
            if (existingPromise) {
                // If an existing promise is found, update it
                existingPromise.promised_positions = promised_positions.map(position => ({ _id: position._id }));
            } else {
                // If no existing promise is found, create a new one
                existingPromise = new Aspiration({
                    _id: studentId,
                    promised_positions: aspirated_positions.map(position => ({ _id: position._id }))
                    // Add other properties of the promise schema if needed
                });
            }
            const savedPromise = await existingPromise.save();
    
            res.status(201).json({ promise: savedPromise });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    get_aspiration: async(req,res) => {
        try {
            const studentId = req.account.id;
    
            if (!studentId) {
                return res.status(400).json("Student ID is required");
            }
    
            const studentAspirations = await Aspiration.findById(studentId)
                .populate('promised_positions', 'name business'); // Populate with the desired fields
    
            if (!studentAspirations) {
                return res.status(404).json("Student aspirations not found");
            }
    
            res.status(200).json({ aspirations: studentAspirations.promised_positions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    
};

module.exports = promiseController;
