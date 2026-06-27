<template>
  <div class="filter-section">
    <div class="filter-row">
      <div class="search-wrapper">
        <i class="fa-solid fa-search search-icon"></i>
        <input
          v-model="searchValue"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
          @input="handleSearch"
        />
      </div>
      
      <select
        v-model="typeValue"
        class="filter-select"
        @change="$emit('update:type', typeValue)"
      >
        <option v-for="option in typeOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      
      <select
        v-model="brandValue"
        class="filter-select"
        @change="$emit('update:brand', brandValue)"
      >
        <option v-for="option in brandOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      
      <select
        v-model="priceValue"
        class="filter-select"
        @change="$emit('update:price', priceValue)"
      >
        <option v-for="option in priceOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      
      <select
        v-if="showCondition"
        v-model="conditionValue"
        class="filter-select"
        @change="$emit('update:condition', conditionValue)"
      >
        <option v-for="option in conditionOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
    
    <div class="sort-row">
      <div class="sort-info">
        <span class="result-count">共 {{ resultCount }} 个结果</span>
      </div>
      <select
        v-model="sortValue"
        class="filter-select sort-select"
        @change="$emit('update:sort', sortValue)"
      >
        <option v-for="option in sortOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  typeOptions: string[];
  brandOptions: string[];
  priceOptions: string[];
  conditionOptions?: string[];
  sortOptions: Array<{ value: string; label: string }>;
  searchPlaceholder?: string;
  showCondition?: boolean;
  resultCount?: number;
  type?: string;
  brand?: string;
  price?: string;
  condition?: string;
  sort?: string;
  search?: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: '搜索…',
  showCondition: false,
  resultCount: 0
});

const emit = defineEmits<{
  (e: 'update:type', value: string): void;
  (e: 'update:brand', value: string): void;
  (e: 'update:price', value: string): void;
  (e: 'update:condition', value: string): void;
  (e: 'update:sort', value: string): void;
  (e: 'update:search', value: string): void;
}>();

const searchValue = ref(props.search || '');
const typeValue = ref(props.type || '');
const brandValue = ref(props.brand || '');
const priceValue = ref(props.price || '');
const conditionValue = ref(props.condition || '');
const sortValue = ref(props.sort || '');

const handleSearch = () => {
  emit('update:search', searchValue.value);
};

watch(() => props.search, (val) => {
  searchValue.value = val || '';
});

watch(() => props.type, (val) => {
  typeValue.value = val || '';
});

watch(() => props.brand, (val) => {
  brandValue.value = val || '';
});

watch(() => props.price, (val) => {
  priceValue.value = val || '';
});

watch(() => props.condition, (val) => {
  conditionValue.value = val || '';
});

watch(() => props.sort, (val) => {
  sortValue.value = val || '';
});
</script>

<style scoped>
.filter-section {
  background: #2D3748;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #4A5F8B;
  margin-bottom: 24px;
}

.filter-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 12px;
  margin-bottom: 16px;
}

@media (max-width: 1024px) {
  .filter-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .filter-row {
    grid-template-columns: 1fr;
  }
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #B8C6D8;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  background: #1E2532;
  border: 1px solid #4A5F8B;
  color: #F5F7FA;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  outline: 2px solid #6B7C93;
  outline-offset: 2px;
  border-color: #6B7C93;
  box-shadow: 0 0 0 3px rgba(74, 95, 139, 0.15);
}

.search-input::placeholder {
  color: #6B7C93;
}

.filter-select {
  padding: 12px 36px 12px 16px;
  background: #1E2532;
  border: 1px solid #4A5F8B;
  color: #F5F7FA;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23B8C6D8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.filter-select:focus {
  outline: 2px solid #6B7C93;
  outline-offset: 2px;
  border-color: #6B7C93;
  box-shadow: 0 0 0 3px rgba(74, 95, 139, 0.15);
}

.filter-select:hover {
  border-color: #6B7C93;
}

.sort-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(74, 95, 139, 0.2);
}

.result-count {
  font-size: 14px;
  color: #6B7C93;
}

.sort-select {
  min-width: 160px;
}
</style>
