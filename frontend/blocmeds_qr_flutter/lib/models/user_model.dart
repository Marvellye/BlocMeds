// lib/models/user_model.dart
import 'package:hive/hive.dart';

part 'user_model.g.dart';  // Generate with flutter pub run build_runner build

@HiveType(typeId: 0)
class User extends HiveObject {
  @HiveField(0)
  double balance;

  @HiveField(1)
  int scans;

  @HiveField(2)
  int streak;

  @HiveField(3)
  int reports;

  @HiveField(4)
  int trustScore;

  @HiveField(5)
  String rank;

  @HiveField(6)
  List<String> transactions;

  @HiveField(7)
  List<String> recentActivity;

  @HiveField(8)
  List<String> generatedHistory;

  @HiveField(9)
  List<Map<String, dynamic>> reportsHistory;  // e.g., {'batchId': '', 'location': '', 'store': '', 'description': '', 'photos': []}

  @HiveField(10)
  List<String> achievements;

  User({
    this.balance = 0.0,
    this.scans = 0,
    this.streak = 0,
    this.reports = 0,
    this.trustScore = 0,
    this.rank = 'Bronze',
    this.transactions = const [],
    this.recentActivity = const [],
    this.generatedHistory = const [],
    this.reportsHistory = const [],
    this.achievements = const [],
  });

  void updateTrustScore() {
    trustScore = (scans * 10 + reports * 50);
    if (trustScore < 100) {
      rank = 'Bronze';
    } else if (trustScore < 500) {
      rank = 'Silver';
    } else if (trustScore < 1000) {
      rank = 'Gold';
    } else {
      rank = 'Platinum';
    }
  }

  void addAchievement(String achievement) {
    if (!achievements.contains(achievement)) {
      achievements.add(achievement);
    }
  }
}