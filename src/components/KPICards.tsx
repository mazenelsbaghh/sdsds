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
      color: '#e94560',
      gradient: 'linear-gradient(135deg, #e94560, #f06b7a)',
    },
    {
      title: 'القضايا المجانية',
      value: stats.freeCases,
      icon: <MoneyOff />,
      color: '#ffd700',
      gradient: 'linear-gradient(135deg, #ffd700, #ffeb3b)',
    },
    {
      title: 'المحامين النشطين',
      value: stats.activeLawyers,
      icon: <People />,
      color: '#533483',
      gradient: 'linear-gradient(135deg, #533483, #6b4ba0)',
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
      color: '#0f3460',
      gradient: 'linear-gradient(135deg, #0f3460, #1e40af)',
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
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: 4, 
      mb: 5 
    }}>
      {kpiData.map((kpi, index) => (
        <Card
          key={index}
          className="kpi-card animate-fadeInUp glow-effect"
          sx={{
            background: `linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92))`,
            border: `1px solid rgba(255, 255, 255, 0.3)`,
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(25px)',
            borderRadius: '32px',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: kpi.gradient,
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '200px',
              height: '200px',
              background: `radial-gradient(circle, ${kpi.color}05 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 0,
            },
            animationDelay: `${index * 0.15}s`,
            '&:hover': {
              transform: 'translateY(-15px) rotate(2deg) scale(1.05)',
              '&::after': {
                background: `radial-gradient(circle, ${kpi.color}10 0%, transparent 70%)`,
              }
            }
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 4, position: 'relative', zIndex: 1 }}>
            <Box
              className="animate-pulse"
              sx={{
                p: 2.5,
                borderRadius: '50%',
                background: kpi.gradient,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 30px ${kpi.color}40`,
                fontSize: '2rem',
                mb: 1,
              }}
            >
              {kpi.icon}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                component="div" 
                sx={{ 
                  fontWeight: 900, 
                  background: kpi.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: `0 4px 8px ${kpi.color}20`,
                  mb: 1,
                  fontSize: '3rem',
                }}
              >
                {kpi.value.toLocaleString()}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#1a1a2e',
                  fontWeight: 600,
                  fontSize: '1.2rem',
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