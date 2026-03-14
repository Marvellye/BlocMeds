// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class UserAdapter extends TypeAdapter<User> {
  @override
  final int typeId = 0;

  @override
  User read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return User(
      balance: fields[0] as double,
      scans: fields[1] as int,
      streak: fields[2] as int,
      reports: fields[3] as int,
      trustScore: fields[4] as int,
      rank: fields[5] as String,
      transactions: (fields[6] as List).cast<String>(),
      recentActivity: (fields[7] as List).cast<String>(),
      generatedHistory: (fields[8] as List).cast<String>(),
      reportsHistory: (fields[9] as List)
          .map((dynamic e) => (e as Map).cast<String, dynamic>())
          .toList(),
      achievements: (fields[10] as List).cast<String>(),
    );
  }

  @override
  void write(BinaryWriter writer, User obj) {
    writer
      ..writeByte(11)
      ..writeByte(0)
      ..write(obj.balance)
      ..writeByte(1)
      ..write(obj.scans)
      ..writeByte(2)
      ..write(obj.streak)
      ..writeByte(3)
      ..write(obj.reports)
      ..writeByte(4)
      ..write(obj.trustScore)
      ..writeByte(5)
      ..write(obj.rank)
      ..writeByte(6)
      ..write(obj.transactions)
      ..writeByte(7)
      ..write(obj.recentActivity)
      ..writeByte(8)
      ..write(obj.generatedHistory)
      ..writeByte(9)
      ..write(obj.reportsHistory)
      ..writeByte(10)
      ..write(obj.achievements);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
