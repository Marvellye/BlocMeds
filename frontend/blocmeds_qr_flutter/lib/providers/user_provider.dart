// lib/providers/user_provider.dart
import 'package:flutter/material.dart';
import 'package:blocmeds_qr/models/user_model.dart';
import 'package:blocmeds_qr/utils/storage_service.dart';

class UserProvider extends ChangeNotifier {
  User _user = StorageService.getUser();
  User get user => _user;

  void loadUser() {
    _user = StorageService.getUser();
    notifyListeners();
  }

  void saveUser() {
    StorageService.saveUser(_user);
    notifyListeners();
  }
}