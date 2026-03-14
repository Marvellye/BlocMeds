// lib/utils/storage_service.dart
import 'package:hive/hive.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:blocmeds_qr/models/user_model.dart';

class StorageService {
  static late Box<User> userBox;

  static Future<void> init() async {
    userBox = await Hive.openBox<User>('userBox');
  }

  static User getUser() {
    return userBox.get('currentUser') ?? User();
  }

  static void saveUser(User user) {
    userBox.put('currentUser', user);
  }

  static Future<bool> getThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('isDarkMode') ?? false;
  }

  static Future<void> setThemeMode(bool isDark) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setBool('isDarkMode', isDark);
  }
}