// lib/screens/rewards_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blocmeds_qr/providers/user_provider.dart';

class RewardsScreen extends StatelessWidget {
  const RewardsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).user;
    return Scaffold(
      appBar: AppBar(title: const Text('Rewards')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Balance: ${user.balance} ETH', style: const TextStyle(fontSize: 24)),
            Text('Scans: ${user.scans}'),
            Text('Streak: ${user.streak}'),
            Text('Reports: ${user.reports}'),
            Text('Trust Score: ${user.trustScore}'),
            Text('Rank: ${user.rank}'),
            const SizedBox(height: 20),
            const Text('Transactions', style: TextStyle(fontSize: 20)),
            ListView.builder(
              shrinkWrap: true,
              itemCount: user.transactions.length,
              itemBuilder: (context, index) => ListTile(title: Text(user.transactions[index])),
            ),
            const SizedBox(height: 20),
            const Text('Achievements', style: TextStyle(fontSize: 20)),
            ListView.builder(
              shrinkWrap: true,
              itemCount: user.achievements.length,
              itemBuilder: (context, index) => ListTile(title: Text(user.achievements[index])),
            ),
          ],
        ),
      ),
    );
  }
}