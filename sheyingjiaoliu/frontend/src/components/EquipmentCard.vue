<template>
  <div class="equipment-card">
    <div class="card-image-wrapper">
      <img :src="item.image" :alt="item.name" class="card-image" />
      <div v-if="item.condition" class="badge badge-condition">{{ item.condition }}</div>
      <div v-if="item.seller.isOfficial" class="badge badge-official">官方授权</div>
      <div class="image-overlay">
        <button @click="$emit('viewDetail', item)" class="overlay-btn">
          <i class="fa-solid fa-eye"></i>
          查看详情
        </button>
      </div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <span class="brand">{{ item.brand }}</span>
        <span class="type-tag">{{ item.type }}</span>
      </div>
      
      <h3 class="card-title">{{ item.name }}</h3>
      
      <div class="price-section">
        <p class="price">¥{{ parseInt(item.price).toLocaleString() }}</p>
        <p v-if="item.originalPrice !== item.price" class="original-price">
          ¥{{ parseInt(item.originalPrice).toLocaleString() }}
        </p>
      </div>
      
      <div v-if="showDetails && tradeType === 'used'" class="details-section">
        <div class="detail-row">
          <span class="detail-label">使用时长:</span>
          <span class="detail-value">{{ item.usageTime }}</span>
        </div>
        <div v-if="item.shutterCount" class="detail-row">
          <span class="detail-label">快门次数:</span>
          <span class="detail-value">{{ item.shutterCount }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">维修记录:</span>
          <span class="detail-value">{{ item.repairHistory }}</span>
        </div>
      </div>
      
      <div v-if="showDetails && tradeType === 'new'" class="details-section">
        <div class="detail-row">
          <span class="detail-label">保修:</span>
          <span class="detail-value">{{ item.warranty }}</span>
        </div>
      </div>
      
      <div class="seller-section">
        <div class="seller-info">
          <img :src="item.seller.avatar" :alt="item.seller.name" class="seller-avatar" />
          <div class="seller-details">
            <p class="seller-name">{{ item.seller.name }}</p>
            <div class="seller-stats">
              <i class="fa-solid fa-star"></i>
              <span>{{ item.seller.rating }}</span>
              <span class="divider">|</span>
              <span>{{ item.seller.completedTransactions }}单</span>
            </div>
          </div>
        </div>
        <span class="seller-location">{{ item.seller.location }}</span>
      </div>
      
      <div class="card-actions">
        <button @click="$emit('viewDetail', item)" class="action-btn btn-outline">
          查看详情
        </button>
        <button @click="$emit('contact', item.seller)" class="action-btn btn-primary">
          {{ tradeType === 'used' ? '联系卖家' : '立即购买' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  brand: string;
  price: string;
  originalPrice: string;
  image: string;
  condition?: string;
  usageTime?: string;
  shutterCount?: string;
  repairHistory?: string;
  warranty?: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    rating: number;
    completedTransactions: number;
    isOfficial?: boolean;
  };
  description?: string;
  images?: string[];
  tags?: string[];
  accessories?: string[];
}

interface Props {
  item: EquipmentItem;
  tradeType: 'used' | 'new';
  showDetails?: boolean;
}

withDefaults(defineProps<Props>(), {
  showDetails: true
});

defineEmits<{
  (e: 'viewDetail', item: EquipmentItem): void;
  (e: 'contact', seller: EquipmentItem['seller']): void;
}>();
</script>

<style scoped>
.equipment-card {
  background: #2D3748;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #4A5F8B;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.equipment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px -8px rgba(74, 95, 139, 0.25);
  border-color: #6B7C93;
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.equipment-card:hover .card-image {
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  background: #4A5F8B;
  color: #F5F7FA;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 1;
}

.badge-official {
  top: 48px;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30, 37, 50, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.equipment-card:hover .image-overlay {
  opacity: 1;
}

.overlay-btn {
  padding: 12px 24px;
  background: #4A5F8B;
  color: #F5F7FA;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.overlay-btn:hover {
  background: #6B7C93;
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.brand {
  font-size: 13px;
  color: #6B7C93;
  font-weight: 500;
}

.type-tag {
  font-size: 11px;
  color: #B8C6D8;
  padding: 4px 10px;
  background: rgba(74, 95, 139, 0.1);
  border: 1px solid #4A5F8B;
  border-radius: 12px;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 16px;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #4A5F8B;
  margin: 0;
}

.original-price {
  font-size: 14px;
  color: #718096;
  text-decoration: line-through;
  margin: 0;
}

.details-section {
  background: rgba(74, 95, 139, 0.05);
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 6px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  color: #B8C6D8;
}

.detail-value {
  color: #F5F7FA;
  font-weight: 500;
}

.seller-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid rgba(74, 95, 139, 0.2);
  border-bottom: 1px solid rgba(74, 95, 139, 0.2);
  margin-bottom: 16px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.seller-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4A5F8B;
}

.seller-details {
  flex: 1;
}

.seller-name {
  font-size: 13px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 2px 0;
}

.seller-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #6B7C93;
}

.seller-stats i {
  color: #4A5F8B;
  font-size: 10px;
}

.seller-stats .divider {
  color: #4A5F8B;
  margin: 0 2px;
}

.seller-location {
  font-size: 12px;
  color: #6B7C93;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn:active {
  transform: scale(0.98);
}

.btn-outline {
  background: transparent;
  color: #F5F7FA;
  border: 1px solid #4A5F8B;
}

.btn-outline:hover {
  background: rgba(74, 95, 139, 0.1);
  border-color: #6B7C93;
}

.btn-primary {
  background: linear-gradient(135deg, #4A5F8B, #3A4B6F);
  color: #F5F7FA;
  border: 1px solid #4A5F8B;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #6B7C93, #4A5F8B);
}
</style>
