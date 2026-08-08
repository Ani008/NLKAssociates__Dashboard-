const TSRInitiation = require("../models/TSRInitiation");
const MasterDB = require("../models/MasterDB");

// All numbers here come straight from the DB — no mock/demo data.
// TSRInitiation is the live workflow (Application ID, Applicant, Bank,
// Transaction Type, uploaded documents), MasterDB is the bulk-uploaded
// reference sheet. Nothing here references the old Case/Client/Property
// models — those were never wired up in this codebase.
const getDashboardStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalTSR,
      addedToday,
      addedThisWeek,
      byBank,
      byTransactionType,
      docsAgg,
      distinctBanks,
      totalMasterRecords,
      recentRecords,
    ] = await Promise.all([
      TSRInitiation.countDocuments(),
      TSRInitiation.countDocuments({ createdAt: { $gte: startOfToday } }),
      TSRInitiation.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),

      // Group by bank (skip blank/unset banks)
      TSRInitiation.aggregate([
        { $match: { bank: { $nin: ["", null] } } },
        { $group: { _id: "$bank", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Group by transaction type (normalize case so "LAP"/"lap" don't split)
      TSRInitiation.aggregate([
        { $match: { transactionType: { $nin: ["", null] } } },
        {
          $group: {
            _id: { $toUpper: "$transactionType" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Total uploaded documents across every record
      TSRInitiation.aggregate([
        {
          $project: { fileCount: { $size: { $ifNull: ["$bulkFiles", []] } } },
        },
        { $group: { _id: null, total: { $sum: "$fileCount" } } },
      ]),

      TSRInitiation.distinct("bank", { bank: { $nin: ["", null] } }),
      MasterDB.countDocuments(),

      TSRInitiation.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select("appId applicant bank transactionType refNo createdAt"),
    ]);

    res.json({
      success: true,
      stats: {
        totalTSR,
        addedToday,
        addedThisWeek,
        totalDocuments: docsAgg[0]?.total || 0,
        activeBanks: distinctBanks.length,
        totalMasterRecords,
      },
      bankStats: byBank, // [{ _id: 'ICICI Bank', count: 4 }, ...]
      transactionTypeStats: byTransactionType, // [{ _id: 'LAP', count: 5 }, ...]
      recentRecords,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboardStats };