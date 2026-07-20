import React from 'react';
import { ShieldCheck, Award, CheckCircle2, UserCheck, Star } from 'lucide-react';

export default function ProviderBadge({ badges = [], isVerified = false, tier = 'Standard', showTierOnly = false }) {
  const defaultBadges = [
    {
      _id: 'b1',
      badgeType: 'id_verified',
      title: 'ID Verified',
      icon: 'ShieldCheck',
      description: 'Government identification verified by HomeEase Admin',
      isVerified: true,
    },
    {
      _id: 'b2',
      badgeType: 'skill_certified',
      title: 'Skill Certified',
      icon: 'Award',
      description: 'Certified expertise in plumbing and electrical installations',
      isVerified: true,
    },
    {
      _id: 'b3',
      badgeType: 'background_checked',
      title: 'Background Checked',
      icon: 'UserCheck',
      description: 'Background criminal history check cleared',
      isVerified: true,
    },
  ];

  const activeBadges = badges.length > 0 ? badges : (isVerified ? defaultBadges : []);

  const getTierColor = (t) => {
    switch (t) {
      case 'Platinum':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Gold':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'id_verified':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'skill_certified':
        return <Award className="w-3.5 h-3.5 text-blue-600" />;
      case 'background_checked':
        return <UserCheck className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 my-1">
      {/* Tier Badge */}
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTierColor(tier)}`}>
        <Star className="w-3 h-3 fill-current" />
        {tier} Tier
      </span>

      {!showTierOnly && activeBadges.map((badge) => (
        <span
          key={badge._id || badge.badgeType}
          title={badge.description}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs hover:bg-emerald-100 transition cursor-help"
        >
          {renderIcon(badge.badgeType)}
          <span>{badge.title}</span>
        </span>
      ))}
    </div>
  );
}
