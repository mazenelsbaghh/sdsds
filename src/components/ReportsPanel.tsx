import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  Assessment,
  TrendingUp,
  People,
  Gavel,
  AttachMoney,
  Warning,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { Sponsor, Lawyer, Case, Stats } from '../types';

interface ReportsPanelProps {
  sponsors: Sponsor[];
  lawyers: Lawyer[];
  cases: Case[];
  stats: Stats;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsPanel: React.FC<ReportsPanelProps> = ({
  sponsors,
  lawyers,
  cases,
  stats,
}) => {
  // Chart data preparation
  const sponsorUsageData = sponsors.map(sponsor => ({
    name: sponsor.name,
    used: sponsor.used,
    remaining: Math.max(0, sponsor.packageSize - sponsor.used),
    total: sponsor.packageSize,
  }));

  const caseStatusData = [
    {
      name: 'جديدة',
      value: cases.filter(c => c.status === 'جديدة').length,
      color: '#2196f3',
    },
    {
      name: 'قيد المعالجة',
      value: cases.filter(c => c.status === 'قيد المعالجة').length,
      color: '#ff9800',
    },
    {
      name: 'مكتملة',
      value: cases.filter(c => c.status === 'مكتملة').length,
      color: '#4caf50',
    },
  ];

  const lawyerCaseData = lawyers.map(lawyer => ({
    name: lawyer.name,
    cases: cases.filter(c => c.lawyerId === lawyer.id).length,
    freeCases: cases.filter(c => c.lawyerId === lawyer.id && c.isFree).length,
    paidCases: cases.filter(c => c.lawyerId === lawyer.id && !c.isFree).length,
  }));

  const lowPackageSponsors = sponsors.filter(
    sponsor => (sponsor.packageSize - sponsor.used) <= 5
  );

  const topSponsors = sponsors
    .sort((a, b) => b.used - a.used)
    .slice(0, 5);

  const recentCases = cases
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Assessment />
        التقارير والإحصائيات
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Charts */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 توزيع الرعاة حسب الاستخدام
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sponsorUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sponsorUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⚖️ حالة القضايا
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={caseStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Top Sponsors and Low Package Sponsors */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp color="primary" />
                  🏆 أفضل الرعاة
                </Typography>
                <List>
                  {topSponsors.map((sponsor) => (
                    <ListItem key={sponsor.id}>
                      <ListItemText
                        primary={sponsor.name}
                        secondary={`${sponsor.used}/${sponsor.packageSize} قضية`}
                      />
                      <Chip
                        label={`${((sponsor.used / sponsor.packageSize) * 100).toFixed(0)}%`}
                        color={sponsor.used / sponsor.packageSize > 0.8 ? 'error' : 'success'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning color="warning" />
                  ⚠️ رعاة يحتاجون تجديد
                </Typography>
                <List>
                  {lowPackageSponsors.map((sponsor) => (
                    <ListItem key={sponsor.id}>
                      <ListItemText
                        primary={sponsor.name}
                        secondary={`متبقي: ${sponsor.packageSize - sponsor.used} قضية`}
                      />
                      <Chip
                        label="يحتاج تجديد"
                        color="warning"
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Recent Cases */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Gavel color="primary" />
              📋 أحدث القضايا
            </Typography>
            <List>
              {recentCases.map((case_) => (
                <ListItem key={case_.id}>
                  <ListItemText
                    primary={case_.title}
                    secondary={`${case_.type} - ${case_.status} - ${case_.createdAt}`}
                  />
                  <Chip
                    label={case_.isFree ? 'مجاني' : 'مدفوع'}
                    color={case_.isFree ? 'default' : 'primary'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ReportsPanel;