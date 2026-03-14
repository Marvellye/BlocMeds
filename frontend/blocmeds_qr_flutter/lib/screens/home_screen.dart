// lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blocmeds_qr/providers/user_provider.dart';
import 'package:blocmeds_qr/widgets/custom_button.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).user;
    return Scaffold(
      appBar: AppBar(title: const Text('BlocMeds QR Home')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Quick Actions',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                CustomButton(
                  text: 'Scan QR',
                  onPressed: () => Navigator.pushNamed(context, '/scan'),
                ),
                CustomButton(
                  text: 'Generate QR',
                  onPressed: () => Navigator.pushNamed(context, '/generate'),
                ),
                CustomButton(
                  text: 'Report Fake',
                  onPressed: () => Navigator.pushNamed(context, '/report'),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Text('Recent Activity',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: user.recentActivity.length,
              itemBuilder: (context, index) =>
                  ListTile(title: Text(user.recentActivity[index])),
            ),
            const SizedBox(height: 20),
            const Text('Leaderboard',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            ListView(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                const ListTile(
                    leading: Icon(Icons.emoji_events),
                    title: Text('User1 - 1200 points')),
                const ListTile(
                    leading: Icon(Icons.emoji_events),
                    title: Text('User2 - 900 points')),
                ListTile(
                    leading: const Icon(Icons.emoji_events),
                    title: Text('You - ${user.trustScore} points')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
