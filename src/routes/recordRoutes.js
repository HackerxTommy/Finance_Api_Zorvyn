const express = require('express');
const router = express.Router();
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
  getSummary
} = require('../controllers/recordController');
const { protect, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     FinancialRecord:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         amount:
 *           type: number
 *         type:
 *           type: string
 *           enum: [income, expense]
 *         category:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *     Summary:
 *       type: object
 *       properties:
 *         totalIncome:
 *           type: number
 *         totalExpenses:
 *           type: number
 *         netBalance:
 *           type: number
 *         categoryTotals:
 *           type: object
 *           additionalProperties:
 *             type: number
 *         recentActivity:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FinancialRecord'
 */

/**
 * @swagger
 * /api/records/summary:
 *   get:
 *     summary: Get financial summary (Analyst, Admin)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial summary data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Summary'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 */
router.get('/summary', protect, authorize('Analyst', 'Admin'), getSummary);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record (Analyst, Admin)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinancialRecord'
 *       400:
 *         description: Invalid input
 *   get:
 *     summary: Get all financial records (filtered)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of financial records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinancialRecord'
 */
router.route('/')
  .post(protect, authorize('Analyst', 'Admin'), createRecord)
  .get(protect, authorize('Viewer', 'Analyst', 'Admin'), getRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a financial record (Analyst, Admin)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinancialRecord'
 *       403:
 *         description: Not authorized to update this record
 *       404:
 *         description: Record not found
 *   delete:
 *     summary: Delete a financial record (Admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Record not found
 */
router.route('/:id')
  .put(protect, authorize('Analyst', 'Admin'), updateRecord)
  .delete(protect, authorize('Admin'), deleteRecord);

module.exports = router;
