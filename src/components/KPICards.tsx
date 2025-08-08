import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import {
  Gavel,
  MoneyOff,
  People,
  Reply,
  Campaign,
  Warning,
} from '@mui/icons-material';
import { Stats } from '../types';

interface KPICardsProps {
  stats: Stats;
}

const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
  const kpiData = [
    {
      title: 'إجمالي القضايا',
      value: stats.totalCases,
      icon: <Gavel />,
      color: '#c41e3a',
      gradient: 'linear-gradient(135deg, #c41e3a, #e63946)',
    },
    {
      title: 'القضايا المجانية',
      value: stats.freeCases,
      icon: <MoneyOff />,
      color: '#d4af37',
      gradient: 'linear-gradient(135deg, #d4af37, #f4d03f)',
    },
    {
      title: 'المحامين النشطين',
      value: stats.activeLawyers,
      icon: <People />,
      color: '#1e3a8a',
      gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    },
    {
      title: 'إجمالي الردود',
      value: stats.totalReplies,
      icon: <Reply />,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669, #10b981)',
    },
    {
      title: 'الحملات النشطة',
      value: stats.activeSponsors,
      icon: <Campaign />,
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    },
    {
      title: 'تحتاج تجديد',
      value: stats.lowPackages,
      icon: <Warning />,
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626, #ef4444)',
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
      {kpiData.map((kpi, index) => (
        <Card
          key={index}
          className="kpi-card fade-in-up"
          sx={{
            minWidth: 220,
            flex: '1 1 220px',
            background: kpi.gradient ? `${kpi.gradient}15` : `linear-gradient(135deg, ${kpi.color}15, ${kpi.color}05)`,
            border: `2px solid ${kpi.color}40`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: kpi.gradient || `linear-gradient(90deg, ${kpi.color}, ${kpi.color}80)`,
            },
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
            <Box
              className="pulse"
              sx={{
                p: 2,
                borderRadius: '50%',
                background: kpi.gradient ? `${kpi.gradient}30` : `linear-gradient(135deg, ${kpi.color}30, ${kpi.color}20)`,
                color: kpi.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 20px ${kpi.color}30`,
                fontSize: '1.5rem',
              }}
            >
              {kpi.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: kpi.color,
                  textShadow: `0 2px 4px ${kpi.color}20`,
                  mb: 0.5,
                }}
              >
                {kpi.value.toLocaleString()}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 500,
                  opacity: 0.8,
                }}
              >
                {kpi.title}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default KPICards;