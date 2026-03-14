// lib/screens/report_screen.dart
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:provider/provider.dart';
import 'package:blocmeds_qr/providers/user_provider.dart';
import 'package:blocmeds_qr/widgets/custom_button.dart';

class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  final TextEditingController _batchIdController = TextEditingController();
  final TextEditingController _detailsController = TextEditingController();

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final String? batchId =
        ModalRoute.of(context)?.settings.arguments as String?;
    if (batchId != null) {
      _batchIdController.text = batchId;
    }
  }

  void _submitReport() {
    if (_batchIdController.text.isEmpty) {
      Fluttertoast.showToast(msg: 'Please enter a Batch ID');
      return;
    }
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    userProvider.user.balance += 50.0;
    userProvider.user.reports++;
    userProvider.user.transactions
        .add('+50 ETH for reporting ${_batchIdController.text}');
    userProvider.user.recentActivity.add('Reported ${_batchIdController.text}');
    userProvider.user.updateTrustScore();
    userProvider.saveUser();
    Fluttertoast.showToast(msg: 'Report submitted successfully');
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Success'),
        content: const Text('Report submitted and saved.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(_);
              Navigator.pop(context);
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _batchIdController.dispose();
    _detailsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Report Fake Drug')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _batchIdController,
              decoration: const InputDecoration(labelText: 'Batch ID'),
            ),
            TextField(
              controller: _detailsController,
              decoration:
                  const InputDecoration(labelText: 'Details (Optional)'),
              maxLines: 3,
            ),
            const SizedBox(height: 20),
            CustomButton(text: 'Submit Report', onPressed: _submitReport),
          ],
        ),
      ),
    );
  }
}
