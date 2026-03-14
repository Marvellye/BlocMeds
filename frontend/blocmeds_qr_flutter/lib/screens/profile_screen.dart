// lib/screens/profile_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blocmeds_qr/providers/user_provider.dart';
import 'package:blocmeds_qr/providers/theme_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).user;
    final themeProvider = Provider.of<ThemeProvider>(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Username: User'),  // Mock username
            Text('Trust Score: ${user.trustScore}'),
            Text('Rank: ${user.rank}'),
            const SizedBox(height: 20),
            SwitchListTile(
              title: const Text('Dark Mode'),
              value: themeProvider.isDarkMode,
              onChanged: (value) => themeProvider.toggleTheme(value),
            ),
            const SizedBox(height: 20),
            const Text('Generated History'),
            ListView.builder(
              shrinkWrap: true,
              itemCount: user.generatedHistory.length,
              itemBuilder: (context, index) => ListTile(title: Text(user.generatedHistory[index])),
            ),
            const SizedBox(height: 20),
            const Text('Reports History'),
            ListView.builder(
              shrinkWrap: true,
              itemCount: user.reportsHistory.length,
              itemBuilder: (context, index) => ListTile(title: Text('Reported ${user.reportsHistory[index]['batchId']}')),
            ),
          ],
        ),
      ),
    );
  }
}