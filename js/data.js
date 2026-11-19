/**
 * ============================================================
 * DATA PORTOFOLIO - IZZAN NUHA ZAMRONI
 * ============================================================
 * File ini khusus menyimpan data statis sertifikat & pencapaian.
 * 
 * Petunjuk Pengisian Dokumen / Gambar Sertifikat:
 * - pdf           : Path file dokumen PDF di folder assets/
 *                   Contoh: "assets/sertifikat-bps.pdf" (Kosongkan "" jika belum ada)
 * - image         : Path gambar pratinjau JPG/PNG (Opsional, kosongkan "" jika belum ada)
 * - id            : Nomor ID unik (angka urut)
 * - title         : Nama sertifikat atau pencapaian
 * - issuer        : Instansi atau platform penerbit
 * - date          : Tanggal/Bulan penerbitan
 * - category      : Kategori filter ('pengalaman' | 'sql' | 'kompetensi')
 * - categoryLabel : Label tampilan kategori (misal: "Data & SQL")
 * - description   : Rincian kompetensi / kegiatan
 */

"use strict";

const PORTFOLIO_DATA = {
  certificates: [
    {
      id: 1,
      title: "Sertifikat PKL Badan Pusat Statistik (BPS) Kota Malang",
      issuer: "BPS Kota Malang",
      date: "01 – 31 Juli 2025",
      category: "pengalaman",
      categoryLabel: "Pengalaman",
      description: "Praktik Kerja Lapangan: pengembangan Matching App (frontend), Software Testing & Debugging, serta validasi integritas data antarmuka.",
      pdf: "assets/BPS Kota Malang.pdf",
      image: "",
    },
    {
      id: 2,
      title: "Sertifikat Asisten Praktikum Pemrograman Multimedia & Game",
      issuer: "FST UIN Malang",
      date: "Desember 2025",
      category: "pengalaman",
      categoryLabel: "Pengalaman",
      description: "Penugasan sebagai asisten praktikum, membimbing mahasiswa serta melakukan Quality Inspection & Testing pada logika proyek game sebelum evaluasi.",
      pdf: "assets/IZZAN NUHA ZAMRONI-PRAKTIKUM PEMROGRAMAN MULTIMEDIA & GAME.pdf",
      image: "",
    },
    {
      id: 3,
      title: "Sertifikat Kompetensi Sains & Teknologi (KST PTKI II)",
      issuer: "UIN Jambi / Forum Dekan Saintek",
      date: "2026",
      category: "kompetensi",
      categoryLabel: "Kompetensi",
      description: "Sertifikasi pengujian dan pemahaman kompetensi bidang sains dan teknologi tingkat PTKI se-Indonesia.",
      pdf: "assets/KST.pdf",
      image: "",
    },
    {
      id: 4,
      title: "DQLab SQL: SELECT Statement",
      issuer: "DQLab",
      date: "Oktober 2026",
      category: "sql",
      categoryLabel: "Data & SQL",
      description: "Fundamental SQL: query data, filtering kriteria tertentu, dan pengambilan data spesifik dengan klausa SELECT.",
      pdf: "assets/Fundamental SQL.pdf",
      image: "",
    },
    {
      id: 5,
      title: "DQLab SQL: FUNCTION & GROUP BY",
      issuer: "DQLab",
      date: "Oktober 2026",
      category: "sql",
      categoryLabel: "Data & SQL",
      description: "Fundamental SQL: pemanfaatan fungsi agregasi matematis/string dan pengelompokan baris data menggunakan GROUP BY dan HAVING.",
      pdf: "assets/Fundamental SQL and Group BY.pdf",
      image: "",
    },
    {
      id: 6,
      title: "DQLab SQL: INNER JOIN & UNION",
      issuer: "DQLab",
      date: "Oktober 2026",
      category: "sql",
      categoryLabel: "Data & SQL",
      description: "Fundamental SQL: relasi antar-tabel menggunakan INNER JOIN serta penggabungan hasil dataset dengan UNION.",
      pdf: "assets/Fundamental SQL Using Inner Join.pdf",
      image: "",
    },
    {
      id: 7,
      title: "International Bootcamp SmartPath: Career Planning for IT/Computer",
      issuer: "SmartPath",
      date: "Januari 2024",
      category: "kompetensi",
      categoryLabel: "Kompetensi",
      description: "Bootcamp internasional penyusunan roadmap karier profesional di industri IT, software engineering, dan data.",
      pdf: "assets/Smart Path.pdf",
      image: "",
    },
    {
      id: 8,
      title: "MySkill: Microsoft Excel Basic (Specialization & 8 Courses)",
      issuer: "MySkill",
      date: "November 2026",
      category: "excel",
      categoryLabel: "Microsoft Excel",
      description: "Sertifikasi Spesialisasi Microsoft Excel Basic (8 jam pelatihan / 8 materi): Aggregate Data, Basic Formula, Conditional IF-ELSE, Data Cleansing, Sort & Filter, Data Formatting, Home Tab, Excel Features, dan Worksheet Management.",
      pdf: "assets/My Skill Excel Basic ALL.pdf",
      image: "",
    },
    {
      id: 9,
      title: "MySkill: Microsoft Excel Intermediate (Specialization & 19 Courses)",
      issuer: "MySkill",
      date: "November 2026",
      category: "excel",
      categoryLabel: "Microsoft Excel",
      description: "Sertifikasi Spesialisasi Microsoft Excel Intermediate (19 jam pelatihan / 19 materi): Charting, Pivot Table (#1-#4), Data Visualization Best Practices, Interactive Charts, Lookup & INDEX MATCH, Dynamic Array Formulas, Logical Functions, Date/Time Manipulation, Error Handling, dan Table Features.",
      pdf: "assets/My Skill Excel Intermediate ALL.pdf",
      image: "",
    },
  ],
};
