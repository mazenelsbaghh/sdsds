import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Reply,
  PersonAdd,
  DateRange,
  Assessment,
} from '@mui/icons-material';
import { Sponsor, MarketingStats, Task } from '../types';

interface MarketingPanelProps {
  sponsors: Sponsor[];
}

const MarketingPanel: React.FC<MarketingPanelProps> = ({ sponsors }) => {
  const [selectedSponsor, setSelectedSponsor] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const generateTasks = () => {
      const newTasks: Task[] = [];
      const today = new Date();
      for (let i = 0; i < 4; i++) {
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + (i * 15));
        newTasks.push({
          id: `task-${i}`,
          description: `مهمة كل 15 يوم: مراجعة الحملات والإحصائيات`,
          dueDate: dueDate.toISOString().split('T')[0],
          completed: false,
        });
      }
      setTasks(newTasks);
    };
    generateTasks();
  }, []);

  const marketingStats = useMemo(() => {
    return sponsors.map((sponsor): MarketingStats => {
      const totalClients = sponsor.packageSize;
      const repliedClients = sponsor.replies;
      const subscribedClients = Math.floor(Math.random() * totalClients);
      const pendingCases = Math.floor(Math.random() * 10);
      const referrals = Math.floor(Math.random() * 5);
      const newClients = Math.floor(Math.random() * 20) + 5;
      const conversionRate = totalClients > 0 ? (repliedClients / totalClients) * 100 : 0;
      const revenue = newClients * 100 + referrals * 50;
      const topCampaign = 'حملة رئيسية';
      return {
        sponsorId: sponsor.id,
        sponsorName: sponsor.name,
        startDate,
        endDate,
        totalClients,
        subscribedClients,
        pendingCases,
        referrals,
        repliedClients,
        newClients,
        conversionRate,
        revenue,
        topCampaign,
      };
    });
  }, [sponsors, startDate, endDate]);

  const filteredStats = useMemo(() => {
    if (!selectedSponsor) return marketingStats;
    return marketingStats.filter(stat => stat.sponsorId === selectedSponsor);
  }, [marketingStats, selectedSponsor]);

  const totalStats = useMemo(() => {
    return filteredStats.reduce(
      (acc, stat) => ({
        totalClients: acc.totalClients + stat.totalClients,
        repliedClients: acc.repliedClients + stat.repliedClients,
        newClients: acc.newClients + stat.newClients,
        revenue: acc.revenue + (stat.revenue || 0),
      }),
      { totalClients: 0, repliedClients: 0, newClients: 0, revenue: 0 }
    );
  }, [filteredStats]);

  const overallConversionRate = totalStats.totalClients > 0 
    ? (totalStats.repliedClients / totalStats.totalClients) * 100 
    : 0;

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assessment />
            تقارير التسويق والإحصائيات
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>اختر الراعي</InputLabel>
              <Select
                value={selectedSponsor}
                label="اختر الراعي"
                onChange={(e) => setSelectedSponsor(e.target.value)}
              >
                <MenuItem value="">جميع الرعاة</MenuItem>
                {sponsors.map((sponsor) => (
                  <MenuItem key={sponsor.id} value={sponsor.id}>
                    {sponsor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="من تاريخ"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="إلى تاريخ"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* إحصائيات عامة بسيطة */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 3, 
            mb: 4 
          }}>
            <Card sx={{ background: '#f0f0f0', border: '1px solid #ddd' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ p: 2, borderRadius: '50%', background: '#e0e0e0', color: '#1976d2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <People sx={{ fontSize: '2.5rem' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                  {totalStats.totalClients.toLocaleString()}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  إجمالي العملاء
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ background: '#f0f0f0', border: '1px solid #ddd' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ p: 2, borderRadius: '50%', background: '#e0e0e0', color: '#388e3c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Reply sx={{ fontSize: '2.5rem' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#388e3c', mb: 1 }}>
                  {totalStats.repliedClients.toLocaleString()}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  العملاء المتفاعلين
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ background: '#f0f0f0', border: '1px solid #ddd' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ p: 2, borderRadius: '50%', background: '#e0e0e0', color: '#0288d1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <PersonAdd sx={{ fontSize: '2.5rem' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#0288d1', mb: 1 }}>
                  {totalStats.newClients.toLocaleString()}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  عملاء جدد
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ background: '#f0f0f0', border: '1px solid #ddd' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ p: 2, borderRadius: '50%', background: '#e0e0e0', color: '#f57c00', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <TrendingUp sx={{ fontSize: '2.5rem' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#f57c00', mb: 1 }}>
                  {overallConversionRate.toFixed(1)}%
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  معدل التحويل
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>

      {/* جدول تفصيلي بسيط */}
      <Card sx={{ background: '#f0f0f0', border: '1px solid #ddd' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
            تفاصيل الرعاة والإحصائيات
          </Typography>
          <TableContainer sx={{ borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
            <Table>
              <TableHead sx={{ background: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>اسم الراعي</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>إجمالي العملاء</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>العملاء المشتركين</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>القضايا الناقصة</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>الإحالات</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>العملاء المتفاعلين</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>عملاء جدد</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>معدل التحويل</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>الإيرادات المقدرة</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>أعلى حملة</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>تاريخ الاشتراك</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStats.map((stat) => (
                  <TableRow key={stat.sponsorId}>
                    <TableCell>{stat.sponsorName}</TableCell>
                    <TableCell align="center">{stat.totalClients}</TableCell>
                    <TableCell align="center">{stat.subscribedClients}</TableCell>
                    <TableCell align="center">{stat.pendingCases}</TableCell>
                    <TableCell align="center">{stat.referrals}</TableCell>
                    <TableCell align="center">{stat.repliedClients}</TableCell>
                    <TableCell align="center">{stat.newClients}</TableCell>
                    <TableCell align="center">
                      <Chip label={`${stat.conversionRate.toFixed(1)}%`} color={stat.conversionRate > 50 ? 'success' : stat.conversionRate > 25 ? 'warning' : 'error'} size="small" />
                    </TableCell>
                    <TableCell align="center">{stat.revenue ? `${stat.revenue} ر.س` : '-'}</TableCell>
                    <TableCell align="center">{stat.topCampaign}</TableCell>
                    <TableCell align="center">{sponsors.find(s => s.id === stat.sponsorId)?.subscriptionDate || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* قسم المهام */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">المهام كل 15 يوم</Typography>
        <TableContainer sx={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
          <Table>
            <TableHead sx={{ background: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>الوصف</TableCell>
                <TableCell sx={{ color: 'white' }}>تاريخ الاستحقاق</TableCell>
                <TableCell sx={{ color: 'white' }}>مكتملة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>{task.completed ? 'نعم' : 'لا'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* قسم تحليل البيانات */}
      <Box sx={{ mt: 4, p: 2, background: '#f0f0f0', borderRadius: '8px' }}>
        <Typography variant="h6">تحليل البيانات واقتراحات التطوير</Typography>
        <ul>
          <li>أعلى حملة: {marketingStats[0]?.topCampaign || 'غير متوفر'}</li>
          <li>اقتراح: زيادة الإعلانات في الحملات ذات التحويل العالي</li>
          <li>اقتراح: تحسين الردود لزيادة المشتركين</li>
          <li>اقتراح: إضافة تكامل مع Google Analytics لتحليل أفضل</li>
          <li>اقتراح: تتبع الإيرادات الفعلية من خلال تكامل مع نظام الدفع</li>
          <li>اقتراح: إضافة رسوم بيانية لعرض الاتجاهات</li>
        </ul>
      </Box>
    </Box>
  );
};

export default MarketingPanel;